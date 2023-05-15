import "dotenv/config";
import { msGraphHttpClient } from "../ms-graph-http-client-factory";
import { MS_PeopleDto } from "./models/MS_PeopleDto";
import { toMS_Person, MS_Person } from "./models/MS_Person";
import { getClientCredentialAccessToken } from "../ms-graph-auth";

const AZ_USER_ID = process.env.AZ_USER_ID;

const client = await msGraphHttpClient(getClientCredentialAccessToken);

export const getPeople = (): Promise<MS_Person[]> => {
  if (!AZ_USER_ID) throw new Error("Missing AZ_USER_ID");

  return client
    .get<MS_PeopleDto>(`/users/${AZ_USER_ID}/people`, {
      params: {
        $orderby: "displayName",
        $filter: "companyName eq 'lise GmbH' and personType/class eq 'Person'",
        $top: 1000,
      },
    })
    .then(async (res) => {
      return res.data.value.map(toMS_Person);
    });
};
