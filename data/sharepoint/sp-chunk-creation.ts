import { load } from "cheerio";
import { writeFile } from "node:fs/promises";
import { SharepointChunk } from "../common/types";
import { getKnowledgeBaseArticles, getRootArticles } from "./sp-http-get";
import { SpPage } from "./models/SpPage";
import countTokens from "../common/countTokens";

const destDataPath = "./data/sharepoint/sp-data.json";

async function createDataset(path: string) {
  const kbArticles = await getKnowledgeBaseArticles();
  const rootArticles = await getRootArticles();
  const articles = [...kbArticles, ...rootArticles];
  console.log("\x1b[32m%s\x1b[0m", `Found ${articles.length} Sharepoint pages`);

  const chunkedPages = [...createChunkedPages(articles)];
  console.log(
    "\x1b[32m%s\x1b[0m",
    `Found ${chunkedPages.length} chunks (max 800 tokens) from ${articles.length} pages`
  );

  await writeFile(destDataPath, JSON.stringify(chunkedPages, null, 2));
}

function* createChunkedPages(
  pages: SpPage[],
  maxChunkTokens = 800
): Generator<SharepointChunk> {
  for (const page of pages) {
    if (!page.content) continue;

    const parsed = parseContent(page);
    const chunks = splitContent(parsed.content, maxChunkTokens);

    for (const chunk of chunks) {
      yield {
        ...parsed,
        content: chunk,
        tokens: countTokens(chunk),
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

function parseContent(page: SpPage): SharepointChunk {
  const rawContent = page.content;

  // Remove SharePoint's HTML encoding
  const decodedHtml = rawContent
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&amp;#58;/g, ":")
    .replace(/&amp;#160;/g, " ");

  // Get the content
  const contentRegex = /<div data-sp-rte[^>]*>([\s\S]*?)<\/div>/g;
  const contentArr: string[] = [];
  let contentMatch;
  while ((contentMatch = contentRegex.exec(decodedHtml)) !== null) {
    contentArr.push(contentMatch[1]);
  }
  const content = contentArr.join("\n");

  const $ = load(content);

  $("span, em, br, strong, html, body, head").each(function () {
    $(this).replaceWith($(this).contents());
  });

  const finalContent = $.html();

  return {
    content: finalContent,
    link: `https://lise2.sharepoint.com${page.link}`,
    title: page.title,
    modified: page.modified,
    created: page.created,
    tokens: countTokens(finalContent),
    type: "sharepoint",
  };
}

await createDataset(destDataPath);
