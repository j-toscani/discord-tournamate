import fs from "fs";
import path from "path";
import { Collection } from "discord.js";
import { Command } from "./types";

const commands: Collection<string, Command> = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandPaths = fs.readdirSync(commandsPath).filter(file => file.includes("."));

export function loadCommands() {
  return readCommandsDir(commandsPath, commandPaths);
}

export function getCommands() {
  return commands;
}

async function readCommandsDir(commandsPath: string, commandPaths: string[]) {
  for (const file in commandPaths) {
    const filePath = path.join(commandsPath, file);
    const { default: command } = await import(filePath);

    if ('data' in command && 'execute' in command) {
      commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

