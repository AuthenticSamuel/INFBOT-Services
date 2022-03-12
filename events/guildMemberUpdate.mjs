import { MessageEmbed } from "discord.js";

import { config, getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle nitro messages and user updates
 */

export default async (oldMember, newMember, client) => {

    //* Nitro
    if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) { 

        const boostChannelId = client.guildConfig[newMember.guild.id].channels.boost;
        if (!boostChannelId) return;

        try {

            const boostChannel = newMember.guild.channels.cache.get(boostChannelId);
            const embed = new MessageEmbed()
                .setColor(config.COLOR.NITRO)
                .setThumbnail(newMember.user.avatarURL())
                .setTitle(`${newMember.guild.name} just got boosted!`)
                .setDescription(`<@${newMember.id}> just boosted the server! **${newMember.guild.name}** thanks you for your support!`);
            await boostChannel.send({ embeds: [embed] });
        
        } catch (error) {
        
            console.warn(error);
    
        }
    }

    //* Added role
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {

        const auditChannelId = client.guildConfig[newMember.guild.id].channels.audit;
        if (!auditChannelId) return;

        try {

            const auditChannel = newMember.guild.channels.cache.get(auditChannelId);
            newMember.roles.cache.forEach(async role => {
                if (!oldMember.roles.cache.has(role.id)) await auditChannel.send("`" + `${getAuditDate()} >>> Added role '${role.name}' (ID: ${role.id}) to '${newMember.user.tag}' (ID: ${newMember.user.id})` + "`");
            });

        } catch (error) {
        
            console.warn(error);
    
        }
    }

    //* Removed role
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {

        const auditChannelId = client.guildConfig[newMember.guild.id].channels.audit;
        if (!auditChannelId) return;

        try {

            const auditChannel = newMember.guild.channels.cache.get(auditChannelId);
            oldMember.roles.cache.forEach(async role => {
                if (!newMember.roles.cache.has(role.id)) await auditChannel.send("`" + `${getAuditDate()} >>> Removed role '${role.name}' (ID: ${role.id}) from '${newMember.user.tag}' (ID: ${newMember.user.id})` + "`");
            });

        } catch (error) {
        
            console.warn(error);
        
        }
    }

    //* Nickname update
    if (oldMember.nickname !== newMember.nickname) {

        const auditChannelId = client.guildConfig[newMember.guild.id].channels.audit;
        if (!auditChannelId) return;
        
        try {

            const auditChannel = newMember.guild.channels.cache.get(auditChannelId);
            return await auditChannel.send("`" + `${getAuditDate()} >>> '${newMember.user.tag}' (ID: ${newMember.user.id}) has updated their nickname: '${oldMember.nickname ? oldMember.nickname : "None"}' -> '${newMember.nickname ? newMember.nickname : "None"}'` + "`");
        
        } catch (error) {
        
            console.warn(error);
        
        }
    }
}