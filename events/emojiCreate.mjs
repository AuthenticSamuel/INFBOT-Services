import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for created emojis
 */

export default async (emoji, client) => {

    const auditChannelId = client.guildConfig[channel.guild.id].channels.audit;
    if (!auditChannelId) return;
    
    try {

        const auditChannel = emoji.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${getAuditDate()} >>> Added ${emoji.animated ? "an animated " : ""}emoji '${emoji.name}' (ID: ${emoji.id}) ->` + "`" + `<:${emoji.name}:${emoji.id}>`);
    
    } catch (error) {
        
        console.warn(error);
    
    }
}