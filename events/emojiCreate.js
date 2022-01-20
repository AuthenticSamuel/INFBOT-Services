const auditDate = require("../functions/auditDate");

/**
 * ! Handle logs for created emojis
 */

module.exports = async (emoji, client) => {
    const auditChannelId = client.guildConfig.get(emoji.guild.id)[2];
    if (auditChannelId === "None") return;
    try {
        const auditChannel = emoji.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${auditDate()} >>> Added ${emoji.animated ? "an animated " : ""}emoji '${emoji.name}' (ID: ${emoji.id}) ->` + "`" + `<:${emoji.name}:${emoji.id}>`);
    } catch {console.error}
}