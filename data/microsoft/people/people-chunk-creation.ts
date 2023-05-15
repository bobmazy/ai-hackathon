import { MS_Person } from "./models/MS_Person";
import { writeFile } from "node:fs/promises";
import { getPeople } from "./people-http-get";
import countTokens from "../../common/countTokens";
import { PeopleChunk } from "../../common/types";

const dataPath = "./data/microsoft/people/people-data.json";

async function createDataset(outputFilePath: string) {
  const people = await getPeople();
  console.log("\x1b[32m%s\x1b[0m", `Found ${people.length} people`);

  const chunks = [...createChunkedPeople(people)];
  await writeFile(outputFilePath, JSON.stringify(chunks, null, 2));
}

function* createChunkedPeople(people: MS_Person[]): Generator<PeopleChunk> {
  for (const person of people) {
    const parsedContent = JSON.stringify(person);

    yield {
      title: person.fullName,
      content: parsedContent,
      tokens: countTokens(parsedContent),
      type: "person",
    };
  }
}

await createDataset(dataPath);
