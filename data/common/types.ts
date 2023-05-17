import { MiroItem } from "../miro/models/MiroItem";

export type ChunkType =
  | "sharepoint"
  | "confluence"
  | "person"
  | "miro"
  | "github"
  | "jira";

export type Chunk = {
  title: string;
  content: string;
  tokens: number;
  type: string | ChunkType;
};

export type SharepointChunk = {
  link: string;
  modified: string;
  created: string;
} & Chunk;
export type ConfluenceChunk = {
  link: string;
  modified: string;
} & Chunk;
export type GitHubChunk = {
  link: string;
  modified: string;
} & Chunk;
export type JiraChunk = {
  link: string;
} & Chunk;
export type PeopleChunk = {} & Chunk;
export type MiroChunk = MiroItem & Chunk;

export type EmbeddedChunk<T> = {
  embedding: number[];
} & T &
  Chunk;

export type EmbeddedSourceChunk = EmbeddedChunk<
  | SharepointChunk
  | MiroChunk
  | ConfluenceChunk
  | PeopleChunk
  | GitHubChunk
  | JiraChunk
>;
