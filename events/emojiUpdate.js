const auditDate = require("../functions/auditDate");

/**
 * ! Handle logs for updated emojis
 */

module.exports = async (oldEmoji, newEmoji, client) => {
    if (oldEmoji.name !== newEmoji.name) {
        const auditChannelId = client.guildConfig.get(newEmoji.guild.id)[2];
        if (auditChannelId === "None") return;
        try {
            const auditChannel = newEmoji.guild.channels.cache.get(auditChannelId);
            await auditChannel.send("`" + `${auditDate()} >>> Updated emoji: '${oldEmoji.name}' -> '${newEmoji.name}' (ID: ${newEmoji.id})` + "`");
        } catch {console.error}
    }
}