import { writeFile } from "node:fs/promises";
import coloredLog from "./coloredLog";

export async function saveDataToFile<T>(outputFilePath: string, data: T) {
  try {
    await writeFile(outputFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    coloredLog("Failed to save data to file", "error", error);
  }
}
