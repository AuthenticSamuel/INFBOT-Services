const auditDate = require("../functions/auditDate");

/**
 * ! Handle logs for updated stickers
 */

module.exports = async (oldSticker, newSticker, client) => {
    const auditChannelId = client.guildConfig.get(newSticker.guild.id)[2];
    if (auditChannelId === "None") return;
    try {
        const auditChannel = newSticker.guild.channels.cache.get(auditChannelId);
        if (oldSticker.name !== newSticker.name) await auditChannel.send("`" + `${auditDate()} >>> Sticker updated: '${oldSticker.name}' -> '${newSticker.name}' (ID: ${newSticker.id})` + "`");
        if (oldSticker.description !== newSticker.description) await auditChannel.send("`" + `${auditDate()} >>> Sticker updated ${newSticker.name} (ID: ${newSticker.id}) description: '${oldSticker.description}' -> '${newSticker.description}'` + "`")
    } catch {console.error}
}