const auditDate = require("../functions/auditDate");

module.exports = async (emoji, client) => {

    let auditChannelId = client.guildConfig.get(emoji.guild.id)[2];
    if (auditChannelId === "None") return;

    try {

        let auditChannel = emoji.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${auditDate()} >>> Removed emoji '${emoji.name}' (ID: ${emoji.id})` + "`");

    } catch (error) {

        console.error(error);

    };
    
};