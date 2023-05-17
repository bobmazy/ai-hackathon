import { jiraHttpClient } from "./jira-http-client-factory";
import {
  JiraProject,
  JiraProjectDto,
  JiraProjectsDto,
  toJiraProject,
} from "./models/JiraProject";
import {
  JiraProjectMetadata,
  JiraProjectMetadataDto,
  toJiraProjectMetadata,
} from "./models/JiraProjectMetadata";
import { AxiosError } from "axios";

const client = await jiraHttpClient();

export async function allProjectsMetadata() {
  const maxResults = 50;
  let startAt = 0;
  let isLastPage = false;
  const results: JiraProjectMetadata[] = [];

  while (!isLastPage) {
    const projects = await jiraProjects(startAt, maxResults);

    for (const project of projects) {
      const projectData = await projectMetadata(project);
      if (projectData) {
        results.push(projectData);
      }
    }

    if (projects.length < maxResults) {
      isLastPage = true;
    } else {
      startAt += maxResults;
    }
  }

  return results;
}

async function projectMetadata(
  project: JiraProject
): Promise<JiraProjectMetadata | null> {
  const metadata = await projectMetadataOrNull(project);

  if (!metadata) {
    return null;
  }

  return {
    name: metadata.name,
    modified: metadata.modified,
    key: metadata.key,
    lead: {
      displayName: metadata.lead.displayName,
    },
  };
}

async function jiraProjects(
  startAt: number,
  maxResults: number
): Promise<JiraProjectDto[]> {
  return await client
    .get<JiraProjectsDto>(
      `project/search?startAt=${startAt}&maxResults=${maxResults}`
    )
    .then(async (res) => {
      return res.data.values.map(toJiraProject);
    });
}

async function projectMetadataOrNull(
  project: JiraProject
): Promise<JiraProjectMetadata | null> {
  return await client
    .get<JiraProjectMetadataDto>(`project/${project.key}?expand=lead`)
    .then(async (res) => {
      return toJiraProjectMetadata(res.data);
    })
    .catch((error) => {
      console.error(
        `Error fetching jira project metadata of project with key ${
          project.key
        }: ${(error as AxiosError).message}`
      );
      return null;
    });
}
