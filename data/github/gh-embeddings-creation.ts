import GhChunks from "./gh-data.json";
import { createEmbeddedChunks } from "../embeddings-creation";
import { GitHubChunk } from "../common/types";
import coloredLog from "../common/coloredLog";

const outputFilePath = "./data/github/gh-embeddings.json";

async function createChunks(outputFilePath: string) {
  console.log("Creating embedded chunks for GitHub...");

  await createEmbeddedChunks<GitHubChunk>(GhChunks, outputFilePath);

  coloredLog(
    `Created embedded chunks for GitHub (${GhChunks.length} Chunks)`,
    "success"
  );
}

await createChunks(outputFilePath);
