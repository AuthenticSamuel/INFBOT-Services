const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const formatFullDate = require("../functions/formatFullDate");
const logEvent = require("../functions/logEvent");

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get user information")
        .addUserOption(option => option
            .setName("target")
            .setDescription("User you want information on")
            .setRequired(true))
    , async execute(interaction) {

        let user = interaction.options.getUser("target");
        let member = await interaction.guild.members.cache.get(user.id);
        
        let embed = new MessageEmbed()
            .setColor(config.COLOR.EVENT)
            .setThumbnail(user.avatarURL())
            .setTitle("User Information:")
            .setDescription("Here's some information about this user")
            .addField("Username:", `${user.tag}`);
        if (member.nickname !== null) embed.addField("Nickname: ", `${member.nickname}`);
        embed.addFields(
            { name: "ID:", value: `${user.id}` },
            { name: "Joined this server:", value: `${formatFullDate(member.joinedAt)}` },
            { name: "Joined Discord:", value: `${formatFullDate(user.createdAt)}` }
        );

        await interaction.reply({ embeds: [embed] });
        logEvent(interaction.commandName);
        return;

    },

};