const auditDate = require("../functions/auditDate");

/**
 * ! Handle logs for created channels
 */

module.exports = async (channel, client) => {
	let auditChannelId = client.guildConfig.get(channel.guild.id)[2];
    if (auditChannelId === "None") return;
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
        await auditChannel.send("`" + `${auditDate()} >>> Added ${channelType} '${channel.name}' (ID: ${channel.id})${parent ? ` in category '${parent.name}' (ID: ${parent.id})` : ""}` + "`");
    } catch {console.error}
}