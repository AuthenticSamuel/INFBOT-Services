const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const logEvent = require("../functions/logEvent");
const leadingZeroes = require("../functions/leadingZeroes");
const packageJSON = require("../package.json");

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("Get INFBOT information")
    , async execute(interaction) {

        let client = interaction.client;

        let totalSeconds = (client.uptime / 1000);
        let totalDays = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let totalHours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let totalMinutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${totalDays}:${leadingZeroes(totalHours)}:${leadingZeroes(totalMinutes)}:${leadingZeroes(seconds)}`;

        let pingEmbed = new MessageEmbed()
            .setColor(config.COLOR.EVENT)
            .setTitle("Pinging...");
        const sent = await interaction.reply({ embeds: [pingEmbed], fetchReply: true });
        
        let embed = new MessageEmbed()
            .setColor(config.COLOR.EVENT)
            .setTitle("INFBOT Utilities")
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: "Uptime", value: uptime, inline: true },
                { name: "Developer", value: "Zenyth#0001", inline: true },
                { name: "Ping", value: `Bot: ${sent.createdTimestamp - interaction.createdTimestamp}ms\nAPI: ${Math.round(client.ws.ping)}ms`, inline: true},
                { name: "Users", value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount - 1, 0)} users`, inline: true },
                { name: "Servers", value: `${client.guilds.cache.size} servers`, inline: true },
                { name: "Channels", value: `${client.channels.cache.size} channels`, inline: true },
                { name: "Version", value: packageJSON["version"], inline: true },
                { name: "Node JS", value: process.version, inline: true },
                { name: "Discord JS", value: packageJSON.dependencies["discord.js"], inline: true},
                { name: "Support Server", value: config.SUPPORT_DISCORD_SERVER, inline: false },
                { name: "Source Code", value: config.CODE, inline: false },
                { name: `Last Update [${config.PATCH.DATE}]`, value: config.PATCH.NOTES, inline: false });
        await interaction.editReply({ embeds: [embed] });
        logEvent(interaction.commandName);
        return;

    },

};