export type GitHubUserDto = {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
};

export type GitHubUser = {
  login: string;
  name: string | null;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
};

export function toGitHubUser(user: GitHubUserDto): GitHubUser {
  return {
    login: user.login,
    name: user.name,
    bio: user.bio,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
  };
}
