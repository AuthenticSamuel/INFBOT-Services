const auditDate = require("../functions/auditDate");

module.exports = async (oldrole, newRole, client) => {

    let auditChannelId = client.guildConfig.get(newRole.guild.id)[2];
    if (auditChannelId === "None") return;

    try {

        let auditChannel = newRole.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${auditDate()} >>> ` + "`");

    } catch (error) {

        console.error(error);

    };

};