const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

/**
 * ! Create an error embed
 */

module.exports = (title = "Error", desc = "We've encountered an error.") => {
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(desc)
        .setColor(config.COLOR.ERROR)
    return embed;
}