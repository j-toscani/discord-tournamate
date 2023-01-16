import { REST, Routes } from 'discord.js';
import dotenv from "dotenv";
import getCommandFiles from './getCommandFiles';

dotenv.config();

const commands: string[] = [];
// Grab all the command files from the commands directory you created earlier
const { commandPaths } = getCommandFiles();

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
async function loadToJSON() {
    for (const file of commandPaths) {
        const {default: command} = await import(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env?.BOT_TOKEN ?? "");

// and deploy your commands!
(async () => {
	try {
        await loadToJSON();
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env?.CLIENT_ID ?? '', process.env?.TEST_GUILD_ID ?? ''),
			{ body: commands },
		) as any[];

		console.log(`Successfully reloaded ${data?.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();