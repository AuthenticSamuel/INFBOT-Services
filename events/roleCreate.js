const auditDate = require("../functions/auditDate");

/**
 * ! Handle logs for created roles
 */

module.exports = async (role, client) => {
    const auditChannelId = client.guildConfig.get(role.guild.id)[2];
    if (auditChannelId === "None") return;
    try {
        const auditChannel = role.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${auditDate()} >>> New role '${role.name}' (ID: ${role.id})'` + "`");
    } catch {console.error}
}