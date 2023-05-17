import { Chunk, JiraChunk } from "../common/types";
import countTokens from "../common/countTokens";
import { allProjectsMetadata } from "./jira-http-get";
import { saveDataToFile } from "../common/saveDataToFile";
import { JiraProjectMetadata } from "./models/JiraProjectMetadata";

const dataPath = "./data/jira/jira-data.json";

async function createProjectChunk(
  projectData: JiraProjectMetadata
): Promise<JiraChunk> {
  const projectName = projectData.name;
  const content = `Projekt ${projectName} mit Kürzel ${projectData.key} wird durch Projektmanager / Verantwortlichen ${projectData.lead.displayName} betreut`;

  return {
    content: content.toLowerCase(),
    title: projectName,
    link: `https://lise.atlassian.net/browse/${projectData.key}`,
    tokens: countTokens(content),
    type: "jira",
  };
}

async function processProject(projectData): Promise<Chunk> {
  return await createProjectChunk(projectData);
}

async function createDataset(outputFilePath: string | undefined) {
  if (!outputFilePath) {
    console.error("Please provide a output file path");
    return;
  }

  const projectDetails = await allProjectsMetadata();
  let chunks: Chunk[] = [];

  const projectChunksPromises = projectDetails.map((projectData) =>
    processProject(projectData)
  );
  chunks = await Promise.all(projectChunksPromises);

  await saveDataToFile(dataPath, chunks);
}

await createDataset(dataPath);
