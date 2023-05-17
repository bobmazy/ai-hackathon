import "dotenv/config";
import axios from "axios";
import { base64Str } from "../common/strUtils";

const jiraToken = process.env.JIRA_TOKEN;
const jiraBaseUrl = process.env.JIRA_BASE_URL;
const jiraEmail = process.env.JIRA_EMAIL;

export const jiraHttpClient = () => {
  if (!jiraToken) throw new Error("No Jira token provided.");
  if (!jiraBaseUrl) throw new Error("No Jira base url provided.");
  if (!jiraEmail) throw new Error("No Jira email provided.");

  const base64Secret = base64Str(`${jiraEmail}:${jiraToken}`);
  return axios.create({
    baseURL: jiraBaseUrl,
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${base64Secret}`,
    },
  });
};
