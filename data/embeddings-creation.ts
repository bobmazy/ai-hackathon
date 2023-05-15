import { writeFile } from "node:fs/promises";
import {
  Chunk,
  ConfluenceChunk,
  EmbeddedSourceChunk,
  MiroChunk,
  PeopleChunk,
  SharepointChunk,
} from "./common/types";
import cliProgress, { SingleBar } from "cli-progress";
import SpChunks from "./sharepoint/sp-data.json";
import ConfluenceChunks from "./confluence/confluence-data.json";
import PeopleChunks from "./microsoft/people/people-data.json";
import MiroChunks from "./miro/miro-data.json";
import { openAIApiInstance } from "../src/open-api/open-api-factory";

const openAITextModel = "text-embedding-ada-002";
const openai = openAIApiInstance(openAITextModel);

const progressBar = initProgressBar();
let progressBarIndex = 0;

const embeddedChunks: EmbeddedSourceChunk[] = [];
await createEmbeddedChunks();

progressBar.stop();

await writeFile(
  "./data/embeddings.json",
  JSON.stringify(embeddedChunks, null, 2)
);

function initProgressBar(): SingleBar {
  const progressBar = new SingleBar({}, cliProgress.Presets.shades_classic);
  const chunksCount =
    SpChunks.length +
    ConfluenceChunks.length +
    PeopleChunks.length +
    MiroChunks.length;

  progressBar.start(chunksCount, 0);

  return progressBar;
}

async function createEmbeddedChunks() {
  await createEmbeddedChunk<SharepointChunk>(SpChunks);
  await createEmbeddedChunk<ConfluenceChunk>(ConfluenceChunks);
  await createEmbeddedChunk<PeopleChunk>(PeopleChunks);
  await createEmbeddedChunk<MiroChunk>(MiroChunks);
}

async function createEmbeddedChunk<T extends Chunk>(src: T[]): Promise<void> {
  for (const [_i, chunk] of src.entries()) {
    await new Promise((r) => setTimeout(r, 10));

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
}
