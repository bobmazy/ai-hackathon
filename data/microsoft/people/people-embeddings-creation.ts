import PeopleChunks from "./people-data.json";
import { createEmbeddedChunks } from "../../embeddings-creation";
import { PeopleChunk } from "../../common/types";
import coloredLog from "../../common/coloredLog";

const outputFilePath = "./data/microsoft/people/people-embeddings.json";

async function createChunks(outputFilePath: string) {
  console.log("Creating embedded chunks for Microsoft people...");

  await createEmbeddedChunks<PeopleChunk>(PeopleChunks, outputFilePath);

  coloredLog(
    `Created embedded chunks for Microsoft people (${PeopleChunks.length}`,
    "success"
  );
}

await createChunks(outputFilePath);
