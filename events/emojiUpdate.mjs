import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for updated emojis
 */

export default async (oldEmoji, newEmoji, client) => {
    
    const auditChannelId = client.guildConfig[channel.guild.id].channels.audit;
    if (!auditChannelId) return;

    if (oldEmoji.name !== newEmoji.name) {
        try {

            const auditChannel = newEmoji.guild.channels.cache.get(auditChannelId);
            await auditChannel.send("`" + `${getAuditDate()} >>> Updated emoji: '${oldEmoji.name}' -> '${newEmoji.name}' (ID: ${newEmoji.id})` + "`");
        
        } catch (error) {
        
            console.warn(error);
        
        }
    }
}