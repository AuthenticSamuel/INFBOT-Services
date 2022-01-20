const auditDate = require("../functions/auditDate");

/**
 * ! Handle logs for deleted emojis
 */

module.exports = async (emoji, client) => {
    const auditChannelId = client.guildConfig.get(emoji.guild.id)[2];
    if (auditChannelId === "None") return;
    try {
        const auditChannel = emoji.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${auditDate()} >>> Removed emoji '${emoji.name}' (ID: ${emoji.id})` + "`");
    } catch {console.error}
}