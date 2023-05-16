import { GitHubRepo } from "./models/GitHubRepo";
import { GitHubChunk } from "../common/types";
import {
  contributors,
  gitHubUser,
  publicRepos,
  readmeOrNull,
} from "./gh-http-get";
import { writeFile } from "node:fs/promises";
import countTokens from "../common/countTokens";
import { valueOrFallback } from "../common/strUtils";

const dataPath = "./data/github/github-data.json";

async function createDataset(dataPath: string) {
  const org = "liseGmbH";
  const repos = await publicRepos(org);

  const chunks: GitHubChunk[] = [];
  for await (const chunk of createChunkedRepos(repos, org)) {
    chunks.push(chunk);
  }
  await writeFile(dataPath, JSON.stringify(chunks, null, 2));
}

function* splitContent(content: string, maxTokens = 800): Generator<string> {
  const words = content.split(" ");

  let currentChunk = "";
  let currentTokens = 0;

  for (const word of words) {
    const wordTokens = countTokens(word);
    if (currentTokens + wordTokens + 1 <= maxTokens) {
      currentChunk += (currentChunk ? " " : "") + word;
      currentTokens += wordTokens + 1;
    } else {
      yield currentChunk;
      currentChunk = word;
      currentTokens = wordTokens;
    }
  }

  if (currentChunk) {
    yield currentChunk;
  }
}

async function* createChunkedRepos(
  repos: GitHubRepo[],
  org: string
): AsyncGenerator<GitHubChunk> {
  for (const repo of repos) {
    const singleRepoChunks = await generateChunk(repo, org);
    const projectUrl = `https://github.com/${org}/${repo.name}`;
    for await (const content of singleRepoChunks) {
      for (const chunkContent of splitContent(content)) {
        yield {
          title: `Öffentliches Repository ${projectUrl} der Organisation ${org}`,
          content: chunkContent.trim(),
          link: `https://github.com/${org}/${repo.name}`,
          modified: repo.updatedAt,
          tokens: countTokens(chunkContent),
          type: "github",
        };
      }
    }
  }
}

async function* generateChunk(
  repo: GitHubRepo,
  org: string
): AsyncGenerator<string> {
  let content = "";

  const fallback = "Nicht bekannt";
  content += `Projekt ${repo.name} und Beschreibung ${valueOrFallback(
    repo.description,
    fallback
  )} und Sprache und Technologie ${repo.language} \n`;
  const readme = await readmeOrNull(repo);
  if (readme) {
    content += `README.md von ${repo.name} mit Link ${readme.htmlUrl}${readme.decodedContent} \n`;
  }

  const repoContributors = await contributors(repo, org);
  content += "Mitwirkende Entwickler\n";
  for (const contributor of repoContributors) {
    const user = await gitHubUser(contributor);
    const fullNameOrFallback = valueOrFallback(user.name, fallback);
    const bioOrFallback = valueOrFallback(user.bio, fallback);
    content += `Mitwirkende ${user.login} Klarname ${fullNameOrFallback}  Beschreibung ${bioOrFallback} wie vielen anderen wird gefolgt?  ${user.following} Wie viele folgen ihm? ${user.followers} Andere Projekte ${user.publicRepos} \n`;
  }

  const cleanedContent = cleaned(content);

  for (const chunkContent of splitContent(cleanedContent)) {
    yield chunkContent;
  }
}

function cleaned(content: string): string {
  let cleanedText = content.replace(/[\r\n]+/g, " ");
  cleanedText.replace(/\s+/g, " ").trim();
  return cleanedText.toLowerCase();
}

await createDataset(dataPath);
