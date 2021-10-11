const auditDate = require("../functions/auditDate");

module.exports = async (oldEmoji, newEmoji, client) => {

    if (oldEmoji.name !== newEmoji.name) {
        
        let auditChannelId = client.guildConfig.get(newEmoji.guild.id)[2];
        if (auditChannelId === "None") return;
    
        try {
    
            let auditChannel = newEmoji.guild.channels.cache.get(auditChannelId);
            await auditChannel.send("`" + `${auditDate()} >>> Updated emoji: '${oldEmoji.name}' -> '${newEmoji.name}' (ID: ${newEmoji.id})` + "`");
    
        } catch (error) {
    
            console.error(error);
    
        };

    };

};