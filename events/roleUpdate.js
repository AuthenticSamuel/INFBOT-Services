const auditDate = require("../functions/auditDate");

/**
 * ! Handle logs for updated roles
 */

module.exports = async (oldrole, newRole, client) => {
    const auditChannelId = client.guildConfig.get(newRole.guild.id)[2];
    if (auditChannelId === "None") return;
    try {
        const auditChannel = newRole.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${auditDate()} >>> ` + "`");
    } catch {console.error}
}