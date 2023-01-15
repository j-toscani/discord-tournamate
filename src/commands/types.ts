import { Interaction, SlashCommandBuilder } from "discord.js"

export type Command = {
    command: SlashCommandBuilder,
    execute: (i: Interaction) => void
}