import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions, MessageEmbed } from "discord.js";

import { config } from "../modules/modules.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("clonechannel")
        .setDescription("Clones the current channel (w/o messages).")
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason (optional)")
            .setRequired(false))

    , async execute(interaction) {

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const embed = new MessageEmbed()
                .setColor(config.COLOR.WARNING)
                .setTitle("You need to be an admin to execute this command.");
            return await interaction.reply({ embeds: [embed]});
        };

        const reason = interaction.options.getString("reason");
        if (!reason) reason = "No reason provided.";
        try {interaction.channel.clone()}
        catch (error) {
            console.error(error);
            const embed = new MessageEmbed()
                .setColor(config.COLOR.ERROR)
                .setTitle("An error has occured.");
            return await interaction.reply({ embeds: [embed] })
        }
        const embed = new MessageEmbed()
            .setColor(config.COLOR.EVENT)
            .setTitle("Successfully cloned this channel.")
            .setDescription(`Reason: ${reason}`);
        return await interaction.reply({ embeds: [embed] });
    }
}