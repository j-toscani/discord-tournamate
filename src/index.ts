import { Client, Events, GatewayIntentBits, Message } from "discord.js";
import dotenv from "dotenv";
import fs from "fs/promises";
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
  if (message.attachments?.size === 0) return;

  const attachmentsWithNames = message.attachments.filter(
    (attachment) => attachment.name
  );

  for (const [_key, attachment] of attachmentsWithNames) {
    try {
      await extractAudioAndReply(attachment, message);
    } catch (error) {
      console.error(error);
      message.channel.send(
        `I was not able to extract the audio from ${attachment.name}`
      );
    }
  }
});

async function extractAudioAndReply(attachment: Attachment, message: Message) {
  const audioFileName = `${attachment.name.split(".")[0]}.mp3`;
  const buffer = await (await fetch(attachment.proxyURL)).arrayBuffer();
  await fs.writeFile(attachment.name, Buffer.from(buffer));

  const cmd = `ffmpeg -i ${attachment.name} ${audioFileName}`;

  exec(cmd, (err) => {
    if (err) throw new Error("Could not convert video file.");

    message.channel.send({
      files: [
        {
          name: audioFileName,
          attachment: audioFileName,
          description: `Extracted audio from ${attachment.name}`,
        },
      ],
    });
  });
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
