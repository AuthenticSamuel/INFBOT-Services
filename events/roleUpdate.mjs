import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for updated roles
 */

export default async (oldrole, newRole, client) => {

    const auditChannelId = client.guildConfig[newMember.guild.id].channels.audit;
    if (!auditChannelId) return;

    try {

        const auditChannel = newRole.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${getAuditDate()} >>> ` + "`");

    } catch (error) {
        
        console.warn(error);
    
    }
}