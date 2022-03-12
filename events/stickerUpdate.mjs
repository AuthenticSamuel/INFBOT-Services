import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for updated stickers
 */

export default async (oldSticker, newSticker, client) => {

    const auditChannelId = client.guildConfig[newMember.guild.id].channels.audit;
    if (!auditChannelId) return;

    try {

        const auditChannel = newSticker.guild.channels.cache.get(auditChannelId);
        if (oldSticker.name !== newSticker.name) await auditChannel.send("`" + `${getAuditDate()} >>> Sticker updated: '${oldSticker.name}' -> '${newSticker.name}' (ID: ${newSticker.id})` + "`");
        if (oldSticker.description !== newSticker.description) await auditChannel.send("`" + `${getAuditDate()} >>> Sticker updated ${newSticker.name} (ID: ${newSticker.id}) description: '${oldSticker.description}' -> '${newSticker.description}'` + "`")
    
    } catch (error) {
        
        console.warn(error);
    
    }
}