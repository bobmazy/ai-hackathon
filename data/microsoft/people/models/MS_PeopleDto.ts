export type MS_PeopleDto = {
  value: MS_PersonDto[];
};
export type MS_PersonDto = {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  birthday: string;
  jobTitle: string;
  companyName: string;
  department: string;

  phones: {
    type: string;
    number: string;
  }[];

  userPrincipalName: string;
};
