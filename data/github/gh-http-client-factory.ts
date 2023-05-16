import "dotenv/config";
import axios from "axios";

const githubApiBaseUrl = process.env.GITHUB_API_BASE_URL;
const API_TOKEN = process.env.GITHUB_API_TOKEN;

export const githubHttpClient = () => {
  if (!githubApiBaseUrl) throw new Error("GITHUB_API_BASE_URL not set");
  if (!API_TOKEN) throw new Error("GITHUB_API_TOKEN not set");

  return axios.create({
    baseURL: githubApiBaseUrl,
    headers: {
      Accept: "application/json",
      Authorization: `token ${API_TOKEN}`,
    },
  });
};
