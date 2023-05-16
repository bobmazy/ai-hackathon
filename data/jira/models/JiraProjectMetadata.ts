export type JiraProjectMetadataDto = {
  name: string;
  key: string;
  lead: {
    displayName: string;
  };
};

export type JiraProjectMetadata = {
  name: string;
  key: string;
  lead: {
    displayName: string;
  };
};

export function toJiraProjectMetadata(
  dto: JiraProjectMetadataDto
): JiraProjectMetadata {
  return {
    name: dto.name,
    key: dto.key,
    lead: {
      displayName: dto.lead.displayName,
    },
  };
}
