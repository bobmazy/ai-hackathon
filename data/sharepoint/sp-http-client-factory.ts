import "dotenv/config";
import axios from "axios";

const AZ_SP_ACCESS_TOKEN = process.env.AZ_TOKEN;
const SP_SITE_URL = process.env.SP_SITE_URL;

export const spHttpClient = () => {
  if (!SP_SITE_URL) throw new Error("No site url provided");
  if (!AZ_SP_ACCESS_TOKEN) throw new Error("No access token provided");

  return axios.create({
    baseURL: SP_SITE_URL,
    headers: {
      Authorization: `Bearer ${AZ_SP_ACCESS_TOKEN}`,
      Accept: "application/json;odata=nometadata",
    },
  });
};
