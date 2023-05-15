import { MS_PersonDto } from "./MS_PeopleDto";

export type MS_Person = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;

  jobTitle: string;
  unit: string;

  phoneNumbers: {
    type: string;
    number: string;
  }[];
};

export function toMS_Person(person: MS_PersonDto): MS_Person {
  return {
    id: person.id,
    fullName: person.displayName,
    firstName: person.givenName,
    lastName: person.surname,
    birthday: person.birthday,
    jobTitle: person.jobTitle,
    email: person.userPrincipalName,
    unit: person.department,
    phoneNumbers: person.phones.map((phone) => ({
      type: phone.type,
      number: phone.number,
    })),
  };
}
