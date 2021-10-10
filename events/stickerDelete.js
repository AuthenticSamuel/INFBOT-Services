module.exports = async (sticker, client) => {

    let auditChannelId = client.guildConfig.get(sticker.guild.id)[2];
    if (auditChannelId === "None") return;

    try {

        let auditChannel = sticker.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `Removed sticker '${sticker.name}' (ID: ${sticker.id})` + "`");

    } catch (error) {

        console.error(error);

    };
    
};