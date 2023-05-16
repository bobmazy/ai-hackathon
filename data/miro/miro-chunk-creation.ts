import { MiroItem } from "./models/MiroItem";
import countTokens from "../common/countTokens";
import { getMiroItems } from "./miro-data-parser";
import { MiroChunk } from "../common/types";
import { saveDataToFile } from "../common/saveDataToFile";
import coloredLog from "../common/coloredLog";

const destDataFilePath = "./data/miro/miro-data.json";

async function createDataset(destDataFilePath: string) {
  const items = getMiroItems();
  coloredLog(`Found ${items.length} Miro Items`, "success");

  const chunks = [...createChunkedMiroItems(items)];

  await saveDataToFile(destDataFilePath, chunks);
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
