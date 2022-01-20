const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const formatFullDate = require("../functions/formatFullDate");
const logEvent = require("../functions/logEvent");

/**
 * ! SERVER command
 * ! Gives the initial user relevant information about the server
 */

module.exports = {
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