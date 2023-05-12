import "dotenv/config";
import axios from "axios";

const confluenceApiBaseUrl = process.env.CONFLUENCE_API_BASE_URL;
const API_TOKEN = process.env.CONFLUENCE_API_TOKEN;
const USER_EMAIL = process.env.CONFLUENCE_USER_EMAIL;

export const confluenceHttpClient = () => {
  if (!confluenceApiBaseUrl) throw new Error("CONFLUENCE_API_BASE_URL not set");
  if (!API_TOKEN) throw new Error("CONFLUENCE_API_TOKEN not set");
  if (!USER_EMAIL) throw new Error("CONFLUENCE_USER_EMAIL not set");

  const accessToken = Buffer.from(`${USER_EMAIL}:${API_TOKEN}`).toString(
    "base64"
  );

  return axios.create({
    baseURL: confluenceApiBaseUrl,
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${accessToken}`,
    },
  });
};
