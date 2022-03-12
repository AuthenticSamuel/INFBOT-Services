import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

import config from "../config.js";
import { formatFullDate, logEvent } from "../modules/modules.mjs";

/**
 * ! SERVER command
 * ! Gives the initial user relevant information about the server
 */

const command = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Get server information")
        
    , async execute(interaction) {

        const guild = interaction.guild;
        const guildOwner = guild.members.cache.get(guild.ownerId)
        let embed = new MessageEmbed()
            .setColor(config.COLOR.EVENT)
            .setThumbnail(guild.iconURL())
            .setTitle(`Server Information: ${guild.name}`)
            .setDescription("Here's some information about this server")
            .addFields(
                { name: "Members:", value: `${guild.memberCount}` },
                { name: "Created:", value: `${formatFullDate(guild.createdAt)}` },
                { name: "Owner:", value: `${guildOwner.user.tag} (ID: ${guildOwner.user.id})` })
            if (guild.premiumSubscriptionCount !== null) embed.addField("Nitro boosts:", `${guild.premiumSubscriptionCount} boosts`);
        await interaction.reply({ embeds: [embed] });
        logEvent(interaction.commandName);
        return;
    }
}

export default command;