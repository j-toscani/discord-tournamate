import { join } from "https://deno.land/std@0.173.0/path/mod.ts";
import getPaths from "./lib/getPaths.ts";

export default function getCommandFiles() {
  const { __dirname } = getPaths(import.meta.url);
  const commandsPath = join(__dirname, "./commands");
  return {
    commandsPath: join(__dirname, "./commands"),
    commandPaths: Array.from(Deno.readDirSync(commandsPath)).filter((file) =>
      file.name.includes(".")
    ).map(file => file.name),
  };
}
