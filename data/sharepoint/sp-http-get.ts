import { spHttpClient } from "./sp-http-client-factory";
import { SpPagesDto } from "./models/SpPagesDto";
import { toSpPage, SpPage } from "./models/SpPage";

const spClient = spHttpClient();

const pageContentType =
  "0x0101009D1CB255DA76424F860D91F20E6C4118006F93D9628153AD4096B45E09F378D2FD00B75336EAAD10DE41B2006584B883265B";

export const getKnowledgeBaseArticles = async (): Promise<SpPage[]> => {
  return spClient
    .get<SpPagesDto>(
      "sites/KnowledgeBase/_api/web/lists/GetByTitle('Site Pages')/items",
      {
        params: {
          $select:
            "ContentTypeId,FileRef,CanvasContent1,Title,Modified,Created",
          $expand: "Folder",
          $top: 1000,
          $filter: `ContentTypeId eq '${pageContentType}'`,
        },
      }
    )
    .then((response) => {
      return response.data.value.map(toSpPage);
    });
};

export const getRootArticles = async (): Promise<SpPage[]> => {
  return spClient
    .get<SpPagesDto>("_api/web/lists/GetByTitle('Site Pages')/items", {
      params: {
        $select: "ContentTypeId,FileRef,CanvasContent1,Title,Modified,Created",
        $expand: "Folder",
        $top: 1000,
      },
    })
    .then((response) => {
      return response.data.value.map(toSpPage);
    });
};
