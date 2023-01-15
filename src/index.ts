import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { getCommands, loadCommands } from "./commands";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, connectedClient => {
  console.log(`Ready: Logged in as: ${connectedClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = getCommands().get(interaction.commandName);

  if (!command) {
    console.error(`Command ${interaction.commandName} not found.`);
    return;
  }

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true })
  }
})

loadCommands()
  .then(() => { client.login(process.env.BOT_TOKEN); })
  .catch(err => console.error("Could not load commands", err))

