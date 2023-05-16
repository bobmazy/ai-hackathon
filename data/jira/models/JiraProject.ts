export type JiraProjectsDto = {
  values: JiraProjectDto[];
};

export type JiraProjectDto = {
  key: string;
};

export type JiraProject = {
  key: string;
};

export function toJiraProject(jiraProject: JiraProjectDto): JiraProject {
  return {
    key: jiraProject.key,
  };
}
