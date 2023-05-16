export type GitHubRepoDto = {
  id: number;
  name: string;
  htmlUrl: string;
  owner: {
    login: string;
  };
  description: string | null;
  updated_at: string;
  language: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  owner: {
    login: string;
  };
  description: string | null;
  updatedAt: string;
  language: string;
};

export function toGitHubRepo(repo: GitHubRepoDto): GitHubRepo {
  return {
    id: repo.id,
    name: repo.name,
    owner: repo.owner,
    description: repo.description,
    updatedAt: repo.updated_at,
    language: repo.language,
  };
}
