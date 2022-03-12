import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for deleted roles
 */

export default async (role, client) => {

    const auditChannelId = client.guildConfig[newMember.guild.id].channels.audit;
    if (!auditChannelId) return;

    try {

        const auditChannel = role.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${getAuditDate()} >>> Deleted role '${role.name}' (ID: ${role.id})'` + "`");

    } catch (error) {
        
        console.warn(error);
    
    }
}