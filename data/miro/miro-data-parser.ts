import fs from "fs";

const srcDataFilePath = "./data/miro/src/miro-source.csv";

export const getMiroItems = () => {
  const csvFileContents = fs.readFileSync(srcDataFilePath, "utf-8");
  const csvRows = csvFileContents.split("\n");

  return csvRows.map((row) => {
    const [title, area, identifier, content] = row.split(";");

    return { title, area, identifier, content: content.replace(/\r$/, "") };
  });
};
