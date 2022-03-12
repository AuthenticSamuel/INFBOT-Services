import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for deleted stickers
 */

export default async (sticker, client) => {

    const auditChannelId = client.guildConfig[newMember.guild.id].channels.audit;
    if (!auditChannelId) return;

    try {

        const auditChannel = sticker.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${getAuditDate()} >>> Removed sticker '${sticker.name}' (ID: ${sticker.id})` + "`");
    
    } catch (error) {
        
        console.warn(error);
    
    }
}