import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for removed bans
 */

export default async (ban, client) => {

	const auditChannelId = client.guildConfig[channel.guild.id].channels.audit;
    if (!auditChannelId) return;

    try {

        const logs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_REMOVE",
        });
        const banLog = logs.entries.first();
        const auditChannel = ban.guild.channels.cache.get(auditChannelId);

        if (!banLog) return await auditChannel.send("`" + `${getAuditDate()} >>> User unbanned: '${ban.user.tag}' (ID: ${ban.user.id}) -> Audit log not found` + "`")
        
        const { executor, target } = banLog;
        
        if (target.id === ban.user.id) await auditChannel.send("`" + `${getAuditDate()} >>> User unbanned: '${ban.user.tag}' (ID: ${ban.user.id}) by '${executor.tag}' (ID: ${executor.id})` + "`")
        else await auditChannel.send("`" + `${getAuditDate()} >>> User unbanned: '${ban.user.tag}' (ID: ${ban.user.id}) -> Audit log fetch unsuccessful` + "`");
    
    } catch (error) {
        
        console.warn(error);
    
    }
}