const { Permissions } = require("discord.js");

module.exports = async (oldChannel, newChannel, client) => {
    
    console.log(newChannel.permissionOverwrites.cache);

    // Rename channel
    if (oldChannel.name !== newChannel.name) {

        let auditChannelId = client.guildConfig.get(newChannel.guild.id)[2];
        if (auditChannelId === "None") return;

        try {
            
            let auditChannel = newChannel.guild.channels.cache.get(auditChannelId);
            await auditChannel.send("`" + `Updated channel: '${oldChannel.name}' -> '${newChannel.name}' (ID: ${newChannel.id})` + "`");
    
        } catch (error) {
    
            console.error(error);
    
        };

    };

    // Slow mode
    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {

        let auditChannelId = client.guildConfig.get(newChannel.guild.id)[2];
        if (auditChannelId === "None") return;

        try {
            
            let auditChannel = newChannel.guild.channels.cache.get(auditChannelId);
            await auditChannel.send("`" + `Updated channel '${newChannel.name}' slowmode: '${oldChannel.rateLimitPerUser}s' -> '${newChannel.rateLimitPerUser}s' (ID: ${newChannel.id})` + "`");
    
        } catch (error) {
    
            console.error(error);
    
        };

    };

    // Permissions
    if (oldChannel.permissionOverwrites.cache !== newChannel.permissionOverwrites.cache) {

        let auditChannelId = client.guildConfig.get(newChannel.guild.id)[2];
        if (auditChannelId === "None") return;

        let oldPO = oldChannel.permissionOverwrites.cache;
        let newPO = newChannel.permissionOverwrites.cache;

        try {
            
            let auditChannel = newChannel.guild.channels.cache.get(auditChannelId);
            
            if (oldPO.size < newPO.size) {

                newPO.forEach(async role => {
                    if (!oldPO.has(role.id)) await auditChannel.send("`" + `Updated channel '${newChannel.name}' (ID: ${newChannel.id}): added role '${newChannel.guild.roles.cache.get(role.id).name}' (ID: ${role.id}) permissions` + "`");
                });

            };

            if (oldPO.size > newPO.size) {

                oldPO.forEach(async role => {
                    if (!newPO.has(role.id)) await auditChannel.send("`" + `Updated channel '${newChannel.name}' (ID: ${newChannel.id}): removed role '${newChannel.guild.roles.cache.get(role.id).name}' (ID: ${role.id}) permissions` + "`");
                });

            };

            if (oldPO.size === newPO.size) {

                newPO.forEach(async newRole => {

                    let oldRole = oldPO.get(newRole.id);
                    if (oldRole.allow.bitfield !== newRole.allow.bitfield || oldRole.deny.bitfield !== newRole.deny.bitfield) await auditChannel.send("`" + `Updated channel '${newChannel.name}' (ID: ${newChannel.id}): updated role '${newChannel.guild.roles.cache.get(newRole.id).name}' (ID: ${newRole.id}) allow -> '${newRole.allow.bitfield}' | deny -> '${newRole.deny.bitfield}'` + "`");

                });

            };
    
        } catch (error) {
    
            console.error(error);
    
        };

    };

};