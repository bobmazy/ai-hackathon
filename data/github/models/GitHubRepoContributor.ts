export type GitHubRepoContributorDTO = {
    login: string;
    contributions: number;
}

export type GitHubRepoContributor = {
    loginName: string;
    contributions: number;
}
export function toGitHubContributor(contributor: GitHubRepoContributorDTO): GitHubRepoContributor {
    return {
        loginName: contributor.login,
        contributions: contributor.contributions
    };
}
