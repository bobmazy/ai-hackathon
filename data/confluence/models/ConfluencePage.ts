import { ConfluencePageDto } from "./ConfluencePagesDto";

export type ConfluencePage = {
  id: string;
  title: string;
  lastUpdated: string;
  content: string;
  link: string;
};

export function toConfluencePage(page: ConfluencePageDto): ConfluencePage {
  return {
    id: page.id,
    title: page.title,
    lastUpdated: page.history.lastUpdated.when,
    content: page.body.view.value,
    link: `https://lise.atlassian.net/wiki${page._links.webui}`,
  };
}
