import { SlashCommandBuilder, Interaction } from "discord.js";

const data = new SlashCommandBuilder().setName("server").setDescription("Provides information about the server.");

async function execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    return interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
}

export default { data, execute };
