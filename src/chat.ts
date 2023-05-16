import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { EmbeddedSourceChunk } from "../data/common/types";
import SharepointChunks from "../data/sharepoint/sp-embeddings.json";
import ConfluenceChunks from "../data/confluence/cf-embeddings.json";
import PeopleChunks from "../data/microsoft/people/people-embeddings.json";
import MiroChunks from "../data/miro/miro-embeddings.json";
import GithubChunks from "../data/github/gh-embeddings.json";
import { cosineSimilarity } from "./cosineSimilarity";
import { getGptSystemPromptInfos } from "./SystemPromptInfos";
import { openAIApiInstance } from "./open-api/open-api-factory";
import coloredLog from "../data/common/coloredLog";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
coloredLog("Welcome to the Lise AI assistant!", "lise");
const query = await rl.question("What is your question?\n");

const textEmbeddingClient = openAIApiInstance("text-embedding-ada-002");
const embeddingResponse = await textEmbeddingClient.createEmbedding({
  model: "text-embedding-ada-002",
  input: query,
});
const queryEmbedding = embeddingResponse.data.data[0].embedding;

const sourceData = [
  ...(SharepointChunks as EmbeddedSourceChunk[]),
  ...(ConfluenceChunks as EmbeddedSourceChunk[]),
  ...(PeopleChunks as EmbeddedSourceChunk[]),
  ...(MiroChunks as EmbeddedSourceChunk[]),
  ...(GithubChunks as EmbeddedSourceChunk[]),
];
const rankedResults = sourceData.sort(
  (a, b) =>
    cosineSimilarity(queryEmbedding, b.embedding) -
    cosineSimilarity(queryEmbedding, a.embedding)
);

const topResults = getNumbersUntilSumIs7500(rankedResults);

const gpt4ApiClient = openAIApiInstance("gpt4");
gpt4ApiClient
  .createChatCompletion({
    model: "gpt4",
    messages: [
      {
        role: "system",
        content: "You are an AI assistant that helps people find information.",
      },
      {
        role: "system",
        content: getGptSystemPromptInfos(topResults),
      },
      {
        role: "system",
        content:
          "Du bist ne Kölsche Jung und antwortest auch dementsprechend auf kölsch. Beende deine Antwort immer mit einem FC Köln-Spruch.",
      },
      {
        role: "user",
        content: query,
      },
    ],
  })
  .then((response) => {
    console.log(response.data.choices[0].message?.content);
  })
  .catch((error) => {
    console.log(error);
  });

function getNumbersUntilSumIs7500(
  rankedResults: EmbeddedSourceChunk[]
): EmbeddedSourceChunk[] {
  let tokenSum = 0;
  const result: EmbeddedSourceChunk[] = [];
  for (let i = 0; i < rankedResults.length; i++) {
    if (tokenSum + rankedResults[i].tokens <= 7500) {
      tokenSum += rankedResults[i].tokens;
      result.push(rankedResults[i]);
    } else {
      break;
    }
  }

  return result;
}
