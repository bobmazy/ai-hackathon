import { confluenceHttpClient } from "./cf-http-client-factory";
import { ConfluencePage, toConfluencePage } from "./models/ConfluencePage";
import { ConfluencePagesDto } from "./models/ConfluencePagesDto";

const client = await confluenceHttpClient();

export const getPages = async (spaceKey: string): Promise<ConfluencePage[]> => {
  return client
    .get<ConfluencePagesDto>(`/space/${spaceKey}/content`, {
      params: {
        expand: "body.view,history.lastUpdated",
        limit: 10000,
      },
    })
    .then(async (res) => {
      return res.data.page.results.map(toConfluencePage);
    });
};
