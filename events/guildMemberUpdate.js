const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const auditDate = require("../functions/auditDate");

/**
 * ! Handle nitro messages and user updates
 */

module.exports = async (oldMember, newMember, client) => {
    //* Nitro
    if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) { 
        const boostChannelId = client.guildConfig.get(newMember.guild.id)[1];
        if (boostChannelId === "None") return;
        try {
            let boostChannel = newMember.guild.channels.cache.get(boostChannelId);
            let embed = new MessageEmbed()
                .setColor(config.COLOR.NITRO)
                .setThumbnail(newMember.user.avatarURL())
                .setTitle(`${newMember.guild.name} just got boosted!`)
                .setDescription(`<@${newMember.id}> just boosted the server! **${newMember.guild.name}** thanks you for your support!`);
            await boostChannel.send({ embeds: [embed] });
        } catch {console.error}
    }

    //* Added role
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const auditChannelId = client.guildConfig.get(newMember.guild.id)[2];
        if (auditChannelId === "None") return;
        try {
            const auditChannel = newMember.guild.channels.cache.get(auditChannelId);
            newMember.roles.cache.forEach(async role => {
                if (!oldMember.roles.cache.has(role.id)) await auditChannel.send("`" + `${auditDate()} >>> Added role '${role.name}' (ID: ${role.id}) to '${newMember.user.tag}' (ID: ${newMember.user.id})` + "`");
            });
        } catch {console.error}
    }

    //* Removed role
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const auditChannelId = client.guildConfig.get(newMember.guild.id)[2];
        if (auditChannelId === "None") return;
        try {
            const auditChannel = newMember.guild.channels.cache.get(auditChannelId);
            oldMember.roles.cache.forEach(async role => {
                if (!newMember.roles.cache.has(role.id)) await auditChannel.send("`" + `${auditDate()} >>> Removed role '${role.name}' (ID: ${role.id}) from '${newMember.user.tag}' (ID: ${newMember.user.id})` + "`");
            });
        } catch {console.error}
    }

    //* Nickname update
    if (oldMember.nickname !== newMember.nickname) {
        const auditChannelId = client.guildConfig.get(newMember.guild.id)[2];
        if (auditChannelId === "None") return;
        try {
            const auditChannel = newMember.guild.channels.cache.get(auditChannelId);
            return await auditChannel.send("`" + `${auditDate()} >>> '${newMember.user.tag}' (ID: ${newMember.user.id}) has updated their nickname: '${oldMember.nickname ? oldMember.nickname : "None"}' -> '${newMember.nickname ? newMember.nickname : "None"}'` + "`");
        } catch {console.error}
    }
}