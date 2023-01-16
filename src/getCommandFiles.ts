import fs from "fs";
import path from "path";

export default function getCommandFiles() {
  const commandsPath = path.join(__dirname, "./commands");
  return {
    commandsPath: path.join(__dirname, "./commands"),
    commandPaths: fs
      .readdirSync(commandsPath)
      .filter((file) => file.includes(".")),
  };
}
