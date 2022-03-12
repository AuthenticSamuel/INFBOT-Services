import { getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle logs for updated channels
 */

export default async (oldChannel, newChannel, client) => {
    
    const auditChannelId = client.guildConfig[channel.guild.id].channels.audit;
    if (!auditChannelId) return;

    const auditChannel = newChannel.guild.channels.cache.get(auditChannelId);

    if (oldChannel.name !== newChannel.name) {
        try {

            await auditChannel.send("`" + `${getAuditDate()} >>> Updated channel: '${oldChannel.name}' -> '${newChannel.name}' (ID: ${newChannel.id})` + "`");
        
        } catch (error) {

            console.warn(error);

        }
    };

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
        try {

            await auditChannel.send("`" + `${getAuditDate()} >>> Updated channel '${newChannel.name}' (ID: ${newChannel.id}) slowmode: '${oldChannel.rateLimitPerUser}s' -> '${newChannel.rateLimitPerUser}s'` + "`");
        
        } catch (error) {

            console.warn(error);

        }
    };

    if (oldChannel.permissionOverwrites.cache !== newChannel.permissionOverwrites.cache) {

        const oldPO = oldChannel.permissionOverwrites.cache;
        const newPO = newChannel.permissionOverwrites.cache;

        try {

            if (oldPO.size < newPO.size) {
                newPO.forEach(async role => {
                    if (!oldPO.has(role.id)) await auditChannel.send("`" + `${getAuditDate()} >>> Updated channel '${newChannel.name}' (ID: ${newChannel.id}): added role '${newChannel.guild.roles.cache.get(role.id).name}' (ID: ${role.id}) permissions` + "`");
                });
            }

            if (oldPO.size > newPO.size) {
                oldPO.forEach(async role => {
                    if (!newPO.has(role.id)) await auditChannel.send("`" + `${getAuditDate()} >>> Updated channel '${newChannel.name}' (ID: ${newChannel.id}): removed role '${newChannel.guild.roles.cache.get(role.id).name}' (ID: ${role.id}) permissions` + "`");
                });
            }

            if (oldPO.size === newPO.size) {
                newPO.forEach(async newRole => {
                    const oldRole = oldPO.get(newRole.id);
                    if (oldRole.allow.bitfield !== newRole.allow.bitfield || oldRole.deny.bitfield !== newRole.deny.bitfield) await auditChannel.send("`" + `${getAuditDate()} >>> Updated channel '${newChannel.name}' (ID: ${newChannel.id}): updated role '${newChannel.guild.roles.cache.get(newRole.id).name}' (ID: ${newRole.id}) allow -> '${newRole.allow.bitfield}' | deny -> '${newRole.deny.bitfield}'` + "`");
                });
            }
    
        } catch (error) {

            console.warn(error);

        }
    }

    if (newChannel.type === "GUILD_VOICE" || newChannel.type === "GUILD_STAGE_VOICE") {
        try {

            if (oldChannel.bitrate !== newChannel.bitrate) await auditChannel.send("`" + `${getAuditDate()} >>> Updated channel '${newChannel.name}' (ID: ${newChannel.id}) bitrate: '${Math.round(oldChannel.bitrate / 1000)} kbps' -> '${Math.round(newChannel.bitrate / 1000)} kbps'` + "`");
            if (newChannel.type !== "GUILD_STAGE_VOICE" && oldChannel.userLimit !== newChannel.userLimit) await auditChannel.send("`" + `${getAuditDate()} >>> Updated channel '${newChannel.name}' (ID: ${newChannel.id}) user limit: '${oldChannel.userLimit}' -> '${newChannel.userLimit}'` + "`");
            if (oldChannel.rtcRegion !== newChannel.rtcRegion) await auditChannel.send("`" + `${getAuditDate()} >>> Updated channel '${newChannel.name}' (ID: ${newChannel.id}) RTC region: '${oldChannel.rtcRegion ? oldChannel.rtcRegion : "auto"}' -> '${newChannel.rtcRegion ? newChannel.rtcRegion : "auto"}'` + "`")
        
        } catch (error) {

            console.warn(error);

        }
    }
}