import "dotenv/config";
import { Configuration, OpenAIApi } from "openai";

const API_KEY = process.env.API_KEY;

const getConfig = (model: string) => {
  if (!API_KEY) throw new Error("API_KEY is not set");

  return new Configuration({
    apiKey: API_KEY,
    basePath: `https://lise-openai-gpt4.openai.azure.com/openai/deployments/${model}`,
    baseOptions: {
      headers: {
        "api-key": API_KEY,
      },
      params: {
        "api-version": "2023-03-15-preview",
      },
    },
  });
};

export const openAIApiInstance = (model: string) =>
  new OpenAIApi(getConfig(model));
