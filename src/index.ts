import { Client, Events, GatewayIntentBits, Message } from "discord.js";
import dotenv from "dotenv";
import fs from "fs/promises";
import { promisify } from "util";
import { exec } from "child_process";

import loadCommands, { getCommands } from "./loadCommands";
import { Attachment } from "discord.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on(Events.MessageCreate, async (message) => {
  const MAX_MB = 5;
  if (message.attachments.size === 0 || message.author.bot) return;

  for (const [_key, attachment] of message.attachments) {
    try {
      if (checkFileTooBig(attachment, MAX_MB)) {
        message.channel.send(`Filesize must be below ${MAX_MB}MB.`);
        continue;
      }

      const filename = await extractAudio(attachment, message);

      message.channel.send({
        files: [
          {
            name: filename,
            attachment: filename,
            description: `Extracted audio from ${attachment.name}`,
          },
        ],
      });
    
      await fs.rm(filename);
    } catch (error: any) {
      console.error(error);
      message.channel.send(
        `I was not able to extract the audio from ${attachment.name}.`
      );
    }
  }
});

function checkFileTooBig(attachment: Attachment, maxMb: number = 5) {
  const fileSizeInMb = attachment.size / 1024 / 1000;
  return fileSizeInMb > maxMb;
}

async function extractAudio(attachment: Attachment, message: Message) {
  const audioFileName = `${attachment.name.split(".")[0]}.mp3`;
  const cmd = `ffmpeg -i ${attachment.proxyURL} ${audioFileName}`;

  const promiseExecute = promisify(exec);

  await promiseExecute(cmd);

  return audioFileName;
}

client.once(Events.ClientReady, (connectedClient) => {
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
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

loadCommands()
  .then(() => {
    client.login(process.env.BOT_TOKEN);
  })
  .catch((err) => console.error("Could not load commands", err));
