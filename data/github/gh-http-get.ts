import {githubHttpClient} from "./gh-http-client-factory";
import {GitHubRepo, GitHubRepoDto, toGitHubRepo} from "./models/GitHubRepo";
import {GitHubRepoContributor, GitHubRepoContributorDTO, toGitHubContributor} from "./models/GitHubRepoContributor";
import {GithubRepoReadme, GitHubRepoReadmeDto, toGitHubRepoReadme} from "./models/GitHubRepoReadme";
import {GitHubUser, GitHubUserDto, toGitHubUser} from "./models/GitHubUser";
import {AxiosError} from "axios";

const client = await githubHttpClient();

export async function readmeOrNull(repo: GitHubRepo): Promise<GithubRepoReadme | null> {
        return await client
            .get<GitHubRepoReadmeDto>( `repos/${repo.owner.login}/${repo.name}/readme`)
            .then(async (res) => {
                return toGitHubRepoReadme(res.data);
            })
            .catch((error) => {
                console.error(`Error fetching README.md of ${repo.name}: ${(error as AxiosError).message}`);
                return null;
            });
    }

export async function gitHubUser(contributor: GitHubRepoContributor): Promise<GitHubUser> {
    return client
        .get<GitHubUserDto>(`users/${contributor.loginName}`)
        .then(async (res) => {
            return toGitHubUser(res.data);
        });
}

export async function contributors(repo: GitHubRepo, org: string): Promise<GitHubRepoContributor[]> {
    return client
        .get<GitHubRepoContributorDTO[]>( `repos/${org}/${repo.name}/contributors`)
        .then(async (res) => {
            return res.data.map(toGitHubContributor)
        });
}

export async function publicRepos(org: string): Promise<GitHubRepo[]> {
    return client
        // this is important: type public, be cautious
        .get<GitHubRepoDto[]>(`orgs/${org}/repos?type=public`)
        .then(async (res) => {
            return res.data.map(toGitHubRepo)
        });
}
