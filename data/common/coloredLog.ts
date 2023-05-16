type LogType = "error" | "success" | "lise";

const colors = new Map<LogType, string>([
  ["error", "\x1b[31m%s\x1b[0m"],
  ["success", "\x1b[32m%s\x1b[0m"],
  ["lise", "\x1b[36m%s\x1b[0m"],
]);

export default function coloredLog(
  message: string,
  type: LogType,
  ...optionalParams: any[]
) {
  console.log(colors.get(type), message, ...optionalParams);
}
