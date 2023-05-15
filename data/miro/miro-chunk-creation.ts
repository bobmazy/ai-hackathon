import { MiroItem } from "./models/MiroItem";
import { writeFile } from "node:fs/promises";
import countTokens from "../common/countTokens";
import { getMiroItems } from "./miro-data-parser";
import { MiroChunk } from "../common/types";

const destDataFilePath = "./data/miro/miro-data.json";

async function createDataset(destDataFilePath: string) {
  const items = getMiroItems();
  console.log("\x1b[32m%s\x1b[0m", `Found ${items.length} Miro Items`);
  const chunks = [...createChunkedMiroItems(items)];

  await writeFile(destDataFilePath, JSON.stringify(chunks, null, 2));
}

function* createChunkedMiroItems(items: MiroItem[]): Generator<MiroChunk> {
  for (const item of items) {
    yield {
      title: item.title,
      area: item.area,
      identifier: item.identifier,
      content: item.content ?? "",
      tokens: countTokens(item.content),
      type: "miro",
    };
  }
}

await createDataset(destDataFilePath);
