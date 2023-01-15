import { Interaction, SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder().setName("user").setDescription("Provides information about the user");

async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand() || (interaction.member && !('joinedAt' in interaction?.member))) return;

  await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction?.member?.joinedAt}.`);
}

export default { command, execute };
