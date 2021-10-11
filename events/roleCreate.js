const auditDate = require("../functions/auditDate");

module.exports = async (role, client) => {
    
    let auditChannelId = client.guildConfig.get(role.guild.id)[2];
    if (auditChannelId === "None") return;

    try {

        let auditChannel = role.guild.channels.cache.get(auditChannelId);
        await auditChannel.send("`" + `${auditDate()} >>> New role '${role.name}' (ID: ${role.id})'` + "`");

    } catch (error) {

        console.error(error);

    };

};