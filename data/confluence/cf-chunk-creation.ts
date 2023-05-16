import { ConfluenceChunk } from "../common/types";
import { load } from "cheerio";
import { ConfluencePage } from "./models/ConfluencePage";
import countTokens from "../common/countTokens";
import { getPages } from "./cf-http-get";
import { saveDataToFile } from "../common/saveDataToFile";
import coloredLog from "../common/coloredLog";

const dataPath = "./data/confluence/confluence-data.json";

async function createDataset(dataPath: string) {
  const pages = await getPages("LSVD");
  coloredLog(`Found ${pages.length} pages`, "success");

  const chunks = [...createChunkedPages(pages)];
  await saveDataToFile(dataPath, chunks);
}

function* createChunkedPages(
  pages: ConfluencePage[],
  maxChunkTokens = 600
): Generator<ConfluenceChunk> {
  for (const page of pages) {
    const parsed = parseContent(page);

    const chunks = splitContent(parsed.content, maxChunkTokens);

    for (const chunk of chunks) {
      yield {
        ...parsed,
        content: chunk,
        tokens: countTokens(chunk),
        type: "confluence",
      };
    }
  }
}

function* splitContent(content: string, maxTokens = 800) {
  // const paragraphs = content.split(/(?=<h2|<p|<div|<\/h2|<\/p|<\/div)/);
  const paragraphs = content.split("."); // TODO: evaluate if this is a good idea

  let currentChunk = "";
  let currentTokens = 0;

  for (const paragraph of paragraphs) {
    const paragraphTokens = countTokens(paragraph);
    if (currentTokens + paragraphTokens <= maxTokens) {
      currentChunk += paragraph;
      currentTokens += paragraphTokens;
    } else {
      yield currentChunk;
      currentChunk = paragraph;
      currentTokens = paragraphTokens;
    }
  }

  if (currentChunk) {
    yield currentChunk;
  }
}

function parseContent(page: ConfluencePage): ConfluenceChunk {
  const rawContent = page.content;

  // Remove SharePoint's HTML encoding
  const decodedHtml = rawContent
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&amp;#58;/g, ":")
    .replace(/&amp;#160;/g, " ");

  const $ = load(decodedHtml);

  $("span, em, br, strong, html, body, head").each(function () {
    $(this).replaceWith($(this).contents());
  });

  const finalContent = $.html();

  return {
    content: finalContent,
    link: page.link,
    title: page.title,
    modified: page.lastUpdated,
    tokens: countTokens(finalContent),
    type: "confluence",
  };
}

await createDataset(dataPath);
