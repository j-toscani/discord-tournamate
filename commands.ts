import fs from "fs";
import path from "path";
import {Collection} from "discord.js";

const commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandPaths = fs.readdirSync(commandsPath).filter(file => file.includes("."));

commandPaths.forEach(fileName => {
    const filePath = path.join(commandsPath, fileName);
})
