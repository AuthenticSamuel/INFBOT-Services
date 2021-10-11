const auditDate = require("../functions/auditDate");

module.exports = async (channel, client) => {

	let auditChannelId = client.guildConfig.get(channel.guild.id)[2];
    if (auditChannelId === "None") return;

    try {

        let auditChannel = channel.guild.channels.cache.get(auditChannelId);
        let parent = channel.guild.channels.cache.get(channel.parentId);
        let channelType = "";
        switch (channel.type) {

            case "GUILD_TEXT": channelType = "text channel"; break;
            case "GUILD_VOICE": channelType = "voice channel"; break;
            case "GUILD_CATEGORY": channelType = "category"; break;
            case "GUILD_NEWS": channelType = "news channel"; break;
            case "GUILD_STORE": channelType = "store channel"; break;
            case "GUILD_TEXT": channelType = "text"; break;
            case "GUILD_STAGE_VOICE": channelType = "stage voice channel"; break;
            default: channelType = "channel"; break;

        };

        await auditChannel.send("`" + `${auditDate()} >>> Added ${channelType} '${channel.name}' (ID: ${channel.id})${parent ? ` in category '${parent.name}' (ID: ${parent.id})` : ""}` + "`");

    } catch (error) {

        console.error(error);

    };

};