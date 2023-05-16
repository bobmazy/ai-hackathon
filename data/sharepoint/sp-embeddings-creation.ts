import SharepointChunks from "./sp-data.json";
import { createEmbeddedChunks } from "../embeddings-creation";
import { SharepointChunk } from "../common/types";
import coloredLog from "../common/coloredLog";

const outputFilePath = "./data/sharepoint/sp-embeddings.json";

async function createChunks(outputFilePath: string) {
  console.log("Creating embedded chunks for Sharepoint...");

  await createEmbeddedChunks<SharepointChunk>(SharepointChunks, outputFilePath);

  coloredLog(
    `Created embedded chunks for Sharepoint (${SharepointChunks.length} Chunks)`,
    "success"
  );
}

await createChunks(outputFilePath);
