import { join } from "https://deno.land/std@0.57.0/path/mod.ts";
import { Collection } from "npm:discord.js";
import { Command } from "./types.ts";
import getPaths from "./lib/getPaths.ts";

const commands: Collection<string, Command> = new Collection();
const { __dirname } = getPaths(import.meta.url);
const commandsPath = join(__dirname, "commands");
const commandPaths = Array.from(Deno.readDirSync(commandsPath))
  .filter((file) => file.name.includes("."))
  .map((file) => file.name);

export function loadCommands() {
  return readCommandsDir(commandsPath, commandPaths);
}

export function getCommands() {
  return commands;
}

async function readCommandsDir(commandsPath: string, commandPaths: string[]) {
  for (const file in commandPaths) {
    const filePath = join(commandsPath, file);
    const { default: command } = await import(filePath);

    if ("data" in command && "execute" in command) {
      commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}
