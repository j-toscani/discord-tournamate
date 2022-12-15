import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, connectedClient => {
    console.log(`Ready: Logged in as: ${connectedClient.user.tag}`);
});

client.login(process.env.BOT_TOKEN);

