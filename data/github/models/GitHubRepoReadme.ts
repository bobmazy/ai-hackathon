import {decodedStr} from "../../common/strUtils";

export type GitHubRepoReadmeDto ={
    name: string
    content: string
    encoding: string
    html_url: string
}

export type GithubRepoReadme = {
    name: string
    decodedContent: string
    htmlUrl: string
}

export function toGitHubRepoReadme(
    readme: GitHubRepoReadmeDto
): GithubRepoReadme {
    return {
        name: readme.name,
        decodedContent: decodedStr(readme.content, readme.encoding),
        htmlUrl: readme.html_url
    };
}