import ConfluenceChunks from "./confluence-data.json";
import { createEmbeddedChunks } from "../embeddings-creation";
import { ConfluenceChunk } from "../common/types";
import coloredLog from "../common/coloredLog";

const outputFilePath = "./data/confluence/cf-embeddings.json";

async function createChunks(outputFilePath: string) {
  console.log("Creating embedded chunks for Confluence...");

  await createEmbeddedChunks<ConfluenceChunk>(ConfluenceChunks, outputFilePath);

  coloredLog(
    `Created embedded chunks for Confluence (${ConfluenceChunks.length} Chunks)`,
    "success"
  );
}

await createChunks(outputFilePath);
