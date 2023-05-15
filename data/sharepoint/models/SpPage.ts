import { SpPageDto } from "./SpPagesDto";

export type SpPage = {
  title: string;
  content: string;
  link: string;
  modified: string;
  created: string;
};

export function toSpPage(dto: SpPageDto): SpPage {
  return {
    title: dto.Title,
    content: dto.CanvasContent1,
    link: `https://lise2.sharepoint.com${dto.FileRef}`,
    modified: dto.Modified,
    created: dto.Created,
  };
}
