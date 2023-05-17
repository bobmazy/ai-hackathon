import "dotenv/config";
import {
  ConfluenceChunk,
  EmbeddedChunk,
  EmbeddedSourceChunk,
  GitHubChunk,
  JiraChunk,
  MiroChunk,
  PeopleChunk,
  SharepointChunk,
} from "../data/common/types";

const MIRO_BOARD_LINK = process.env.MIRO_BOARD_LINK;

export function getGptSystemPromptInfos(results: EmbeddedSourceChunk[]) {
  let content =
    "Use and try to combine the following information to answer the question.\n" +
    "Use in your answer the different following information:\n";

  const spArticles: EmbeddedChunk<SharepointChunk>[] = results.filter(
    (result) => result.type === "sharepoint"
  ) as EmbeddedChunk<SharepointChunk>[];
  const cfArticles: EmbeddedChunk<ConfluenceChunk>[] = results.filter(
    (result) => result.type === "confluence"
  ) as EmbeddedChunk<ConfluenceChunk>[];
  const people: EmbeddedChunk<PeopleChunk>[] = results.filter(
    (result) => result.type === "person"
  ) as EmbeddedChunk<PeopleChunk>[];
  const miro: EmbeddedChunk<MiroChunk>[] = results.filter(
    (result) => result.type === "miro"
  ) as EmbeddedChunk<MiroChunk>[];
  const github: EmbeddedChunk<GitHubChunk>[] = results.filter(
    (result) => result.type === "github"
  ) as EmbeddedChunk<GitHubChunk>[];
  const jira: EmbeddedChunk<JiraChunk>[] = results.filter(
    (result) => result.type === "jira"
  ) as EmbeddedChunk<JiraChunk>[];
  
  
  console.log(`Found ${spArticles.length} sharepoint articles`);
  console.log(`Found ${cfArticles.length} confluence articles`);
  console.log(`Found ${people.length} people`);
  console.log(`Found ${miro.length} miro items`);
  console.log(`Found ${github.length} github items`);
  console.log(`Found ${jira.length} jira items`);

  if (spArticles.length > 0) {
    content +=
      "Use the articles from the lise Sharepoint, to answer the question.\n" +
      "Articles:\n" +
      spArticles.map(convertSpChunkToPromptMessage).join("\n") +
      "\n" +
      `In your answers, note today's date ${new Date().toLocaleDateString()} and the date of the articles.\n` +
      "Since you know the date of the article and today's date, you can correct outdated information, such as age or start date, in your answer.\n" +
      "Output the source of your answer with a link to the article.\n";
  }

  if (cfArticles.length > 0) {
    content +=
      "Use the articles from the technical lise Wiki, to answer the question.\n" +
      "Articles:\n" +
      cfArticles.map(convertCfChunkToPromptMessage).join("\n") +
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

  if (github.length > 0) {
    content +=
      "Use the GitHub repositories information of the lise GmbH, to answer the question.\n" +
      "GitHub Infos:\n" +
      github.map(convertGithubChunkToPromptMessage).join("\n") +
      "\n" +
      "Use this information when someone asks for information about projects, programming languages, developers.\n" +
      "Return also a link to the GitHub Repository when useful.\n";
  }

  if (jira.length > 0) {
    content +=
      "Use the Jira information of the lise GmbH, to answer the question.\n" +
      "Jira Infos:\n" +
      jira.map(convertJiraChunkToPromptMessage).join("\n") +
      "\n" +
      "Use this information when someone asks for information about projects, project name abbreviations, project managers and jira boards.\n" +
      "Return also a link to the Jira board of the project when useful.\n";
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
function convertGithubChunkToPromptMessage(chunk: EmbeddedChunk<GitHubChunk>) {
  return (
    `${chunk.title}\n` +
    `${chunk.content}\n` +
    `${chunk.link}\n` +
    `last modified on ${chunk.modified}\n`
  );
}
function convertJiraChunkToPromptMessage(chunk: EmbeddedChunk<JiraChunk>) {
  return (
    `${chunk.title}\n` +
    `${chunk.content}\n` +
    `${chunk.link}\n`
  );
}
