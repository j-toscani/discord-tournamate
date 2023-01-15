import { Interaction, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder().setName("ping").setDescription("Pongs as a reply");

async function execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    return await interaction.reply( {content: "pong!"} );
}

export default { data, execute };
