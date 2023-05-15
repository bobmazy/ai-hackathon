import "dotenv/config";
import {
  ConfluenceChunk,
  EmbeddedChunk,
  EmbeddedSourceChunk,
  MiroChunk,
  PeopleChunk,
  SharepointChunk,
} from "../data/common/types";

const MIRO_BOARD_LINK = process.env.MIRO_BOARD_LINK;

export function getGptSystemPromptInfos(results: EmbeddedSourceChunk[]) {
  let content =
    "Use and try to combine the following information to answer the question.\n" +
    "Use in your answer the different following information:\n";

  const articles: EmbeddedChunk<SharepointChunk>[] = results.filter(
    (result) => result.type === "sharepoint"
  ) as EmbeddedChunk<SharepointChunk>[];
  const confluence: EmbeddedChunk<ConfluenceChunk>[] = results.filter(
    (result) => result.type === "confluence"
  ) as EmbeddedChunk<ConfluenceChunk>[];
  const people: EmbeddedChunk<PeopleChunk>[] = results.filter(
    (result) => result.type === "person"
  ) as EmbeddedChunk<PeopleChunk>[];
  const miro: EmbeddedChunk<MiroChunk>[] = results.filter(
    (result) => result.type === "miro"
  ) as EmbeddedChunk<MiroChunk>[];

  console.log(`Found ${articles.length} articles`);
  console.log(`Found ${confluence.length} confluence articles`);
  console.log(`Found ${people.length} people`);
  console.log(`Found ${miro.length} miro items`);

  if (articles.length > 0) {
    content +=
      "Use the articles from the lise Sharepoint, to answer the question.\n" +
      "Articles:\n" +
      articles.map(convertSpChunkToPromptMessage).join("\n") +
      "\n" +
      `In your answers, note today's date ${new Date().toLocaleDateString()} and the date of the articles.\n` +
      "Since you know the date of the article and today's date, you can correct outdated information, such as age or start date, in your answer.\n" +
      "Output the source of your answer with a link to the article.\n";
  }

  if (confluence.length > 0) {
    content +=
      "Use the articles from the technical lise Wiki, to answer the question.\n" +
      "Articles:\n" +
      confluence.map(convertCfChunkToPromptMessage).join("\n") +
      "\n" +
      `In your answers, note today's date ${new Date().toLocaleDateString()} and the date of the articles.\n` +
      "Since you know the date of the article and today's date, you can correct outdated information, such as age or start date, in your answer.\n" +
      "Use this information when someone asks for technical support\n" +
      "Output the source of your answer with a link to the article.\n";
  }

  if (people.length > 0) {
    content +=
      "Use the list of all employees at the lise GmbH, to answer the question.\n" +
      "Employees:\n" +
      people.map(convertPeopleChunkToPromptMessage).join("\n") +
      "\n" +
      "Use this information when someone asks for information about a person.\n" +
      "return also a contact card with the name, email address, and phone number of the person when useful.\n";
  }

  if (miro.length > 0) {
    content +=
      "Use the Miro board of the lise GmbH, to answer the question.\n" +
      `The Miro Board is available at ${MIRO_BOARD_LINK}\n` +
      "The Miro Board contains information to find things in the office, such as the location of the first aid kit.\n" +
      "Miro Infos:\n" +
      miro.map(convertMiroChunkToPromptMessage).join("\n") +
      "\n" +
      "Use this information when someone asks for information about the office.\n" +
      "Return also a link to the Miro board when useful.\n";
  }

  return content;
}

function convertSpChunkToPromptMessage(chunk: EmbeddedChunk<SharepointChunk>) {
  return (
    `${chunk.title}\n` +
    `${chunk.content}\n` +
    `${chunk.link}\n` +
    `Zuletzt bearbeitet am ${chunk.modified}\n` +
    `Erstellt am ${chunk.created}\n`
  );
}

function convertCfChunkToPromptMessage(chunk: EmbeddedChunk<ConfluenceChunk>) {
  return (
    `${chunk.title}\n` +
    `${chunk.content}\n` +
    `${chunk.link}\n` +
    `last modified on ${chunk.modified}\n`
  );
}

function convertPeopleChunkToPromptMessage(chunk: EmbeddedChunk<PeopleChunk>) {
  return `${chunk.title}\n` + `${chunk.content}\n`;
}

function convertMiroChunkToPromptMessage(chunk: EmbeddedChunk<MiroChunk>) {
  return `${chunk.title}\n` + `${chunk.content}\n`;
}
