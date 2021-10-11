const auditDate = require("../functions/auditDate");

module.exports = async (sticker, client) => {

    let auditChannelId = client.guildConfig.get(sticker.guild.id)[2];
    if (auditChannelId === "None") return;

    try {

        let auditChannel = sticker.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${auditDate()} >>> Added sticker '${sticker.name}' (ID: ${sticker.id})${sticker.description ? ". Description: '" + sticker.description + "'" : ""}` + "`");

    } catch (error) {

        console.error(error);

    };

};