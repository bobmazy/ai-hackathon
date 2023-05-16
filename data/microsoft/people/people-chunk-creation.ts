import { MS_Person } from "./models/MS_Person";
import { getPeople } from "./people-http-get";
import countTokens from "../../common/countTokens";
import { PeopleChunk } from "../../common/types";
import { saveDataToFile } from "../../common/saveDataToFile";
import coloredLog from "../../common/coloredLog";

const dataPath = "./data/microsoft/people/people-data.json";

async function createDataset(outputFilePath: string) {
  const people = await getPeople();
  coloredLog(`Found ${people.length} people`, "success");

  const chunks = [...createChunkedPeople(people)];
  await saveDataToFile(outputFilePath, chunks);
}

function* createChunkedPeople(people: MS_Person[]): Generator<PeopleChunk> {
  for (const person of people) {
    let parsedContent = "";
    Object.keys(person).forEach((key) => {
      if (person[key] === null) return;
      if (key === "id") return;

      if (key === "phoneNumbers") {
        parsedContent += `${key}: `;
        person[key].forEach((phoneNumber) => {
          parsedContent += `${phoneNumber.number} (${phoneNumber.type}). `;
        });
        return;
      }
      parsedContent += `${key}: ${person[key]}. `;
    });

    yield {
      title: person.fullName,
      content: parsedContent,
      tokens: countTokens(parsedContent),
      type: "person",
    };
  }
}

await createDataset(dataPath);
