import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for deleted channels
 */

export default async (channel, client) => {

	const auditChannelId = client.guildConfig[channel.guild.id].channels.audit;
    if (!auditChannelId) return;

    try {

        const auditChannel = channel.guild.channels.cache.get(auditChannelId);
        const parent = channel.guild.channels.cache.get(channel.parentId);
        const getChannelType = (inputType) => {
            switch (inputType) {
                case "GUILD_TEXT": return "text channel";
                case "GUILD_VOICE": return "voice channel";
                case "GUILD_CATEGORY": return "category";
                case "GUILD_NEWS": return "news channel";
                case "GUILD_STORE": return "store channel";
                case "GUILD_TEXT": return "text";
                case "GUILD_STAGE_VOICE": return "stage voice channel";
                default: return "channel";
            }
        }

        const channelType = getChannelType(channel.type);
        await auditChannel.send("`" + `${getAuditDate()} >>> Removed ${channelType} '${channel.name}' (ID: ${channel.id})${parent ? ` from category '${parent.name}' (ID: ${parent.id})` : ""}` + "`");
    
    } catch (error) {
        
        console.warn(error);
    
    }
}