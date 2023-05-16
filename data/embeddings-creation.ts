import { Chunk, EmbeddedSourceChunk } from "./common/types";
import cliProgress, { SingleBar } from "cli-progress";
import { openAIApiInstance } from "../src/open-api/open-api-factory";
import { saveDataToFile } from "./common/saveDataToFile";
import coloredLog from "./common/coloredLog";

const openAITextModel = "text-embedding-ada-002";
const openai = openAIApiInstance(openAITextModel);

function initProgressBar(chunksCount: number): SingleBar {
  const progressBar = new SingleBar({}, cliProgress.Presets.shades_classic);

  progressBar.start(chunksCount, 0);

  return progressBar;
}

export async function createEmbeddedChunks<T extends Chunk>(
  src: T[],
  outputFilePath: string
) {
  const embeddedChunks: EmbeddedSourceChunk[] = [];

  const progressBar = initProgressBar(src.length);
  let progressBarIndex = 0;

  try {
    for (const [_i, chunk] of src.entries()) {
      await new Promise((r) => setTimeout(r, 30));

      const result = await openai.createEmbedding({
        model: openAITextModel,
        input: chunk.content,
      });

      const embedding = result.data.data[0].embedding;
      embeddedChunks.push({
        ...chunk,
        embedding,
      });

      progressBar.update(progressBarIndex + 1);
      progressBarIndex++;
    }
  } catch (e) {
    coloredLog("Failed to create embeddings for chunks", "error");
  }

  progressBar.stop();

  await saveDataToFile(outputFilePath, embeddedChunks);
}
