import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for created stickers
 */

module.exports = async (sticker, client) => {

    const auditChannelId = client.guildConfig[newMember.guild.id].channels.audit;
    if (!auditChannelId) return;

    try {

        const auditChannel = sticker.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${getAuditDate()} >>> Added sticker '${sticker.name}' (ID: ${sticker.id})${sticker.description ? ". Description: '" + sticker.description + "'" : ""}` + "`");
    
    } catch (error) {
        
        console.warn(error);
    
    }
}