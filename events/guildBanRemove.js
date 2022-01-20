const auditDate = require("../functions/auditDate");

/**
 * ! Handle logs for removed bans
 */

module.exports = async (ban, client) => {
	const auditChannelId = client.guildConfig.get(ban.guild.id)[2];
    if (auditChannelId === "None") return;
    try {
        const logs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_REMOVE",
        });
        const banLog = logs.entries.first();
        const auditChannel = ban.guild.channels.cache.get(auditChannelId);
        if (!banLog) return await auditChannel.send("`" + `${auditDate()} >>> User unbanned: '${ban.user.tag}' (ID: ${ban.user.id}) -> Audit log not found` + "`")
        const { executor, target } = banLog;
        if (target.id === ban.user.id) await auditChannel.send("`" + `${auditDate()} >>> User unbanned: '${ban.user.tag}' (ID: ${ban.user.id}) by '${executor.tag}' (ID: ${executor.id})` + "`")
        else await auditChannel.send("`" + `${auditDate()} >>> User unbanned: '${ban.user.tag}' (ID: ${ban.user.id}) -> Audit log fetch unsuccessful` + "`");
    } catch {console.error}
}