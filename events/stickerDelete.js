const auditDate = require("../functions/auditDate");

/**
 * ! Handle logs for deleted stickers
 */

module.exports = async (sticker, client) => {
    const auditChannelId = client.guildConfig.get(sticker.guild.id)[2];
    if (auditChannelId === "None") return;
    try {
        const auditChannel = sticker.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${auditDate()} >>> Removed sticker '${sticker.name}' (ID: ${sticker.id})` + "`");
    } catch {console.error}
}