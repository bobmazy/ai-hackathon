import MiroChunks from "./miro-data.json";
import { createEmbeddedChunks } from "../embeddings-creation";
import { MiroChunk } from "../common/types";
import coloredLog from "../common/coloredLog";

const outputFilePath = "./data/miro/miro-embeddings.json";

async function createChunks(outputFilePath: string) {
  console.log("Creating embedded chunks for Miro...");

  await createEmbeddedChunks<MiroChunk>(MiroChunks, outputFilePath);

  coloredLog(
    `Created embedded chunks for Miro (${MiroChunks.length} Chunks)`,
    "success"
  );
}

await createChunks(outputFilePath);
