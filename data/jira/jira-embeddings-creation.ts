import JiraChunks from "./jira-data.json";
import { createEmbeddedChunks } from "../embeddings-creation";
import { JiraChunk } from "../common/types";
import coloredLog from "../common/coloredLog";

const outputFilePath = "./data/jira/jira-embeddings.json";

async function createChunks(outputFilePath: string) {
  console.log("Creating embedded chunks for Jira...");

  await createEmbeddedChunks<JiraChunk>(JiraChunks, outputFilePath);

  coloredLog(
    `Created embedded chunks for Jira: (${JiraChunks.length} Chunks)`,
    "success"
  );
}

await createChunks(outputFilePath);
