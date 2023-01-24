import { Interaction, SlashCommandBuilder } from "npm:discord.js"

export type Command = {
    command: SlashCommandBuilder,
    execute: (i: Interaction) => void
}