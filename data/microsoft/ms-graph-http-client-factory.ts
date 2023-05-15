import axios from "axios";

export const msGraphHttpClient = async (
  accessTokenCallBack: () => Promise<string>
) => {
  const accessToken = await accessTokenCallBack();

  return axios.create({
    baseURL: "https://graph.microsoft.com/v1.0",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
