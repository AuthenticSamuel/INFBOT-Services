import { MessageEmbed } from "discord.js";

import { config, getAuditDate } from "../modules/modules.mjs";

/**
 * ! Handle sending leave messages
 */

export default async (member, client) => {

	const welcomeChannelId = client.guildConfig[member.guild.id].channels.welcome;
	const auditChannelId = client.guildConfig[member.guild.id].channels.audit;
	if (!welcomeChannelId && !auditChannelId) return;

	try {

		if (welcomeChannelId) {

			const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
			const embed = new MessageEmbed()
				.setColor(config.COLOR.WARNING)
				.setThumbnail(member.user.avatarURL())
				.setTitle("Member left the server.")
				.setDescription(`<@${member.id}> has left **${member.guild.name}**.`);
			await welcomeChannel.send({ embeds: [embed] });

		}

		// TODO

		/*
		if (auditChannelId !== "None") {

			let auditChannel = member.guild.channels.cache.get(auditChannelId);

			const log = await member.guild.fetchAuditLogs({
				limit: 1,
				type: "MEMBER_KICK",
			});

			const kickLog = log.entries.first();
			if (!kickLog) return;

			const { executor, target, reason } = kickLog;

			if (target.id === member.user.id) await auditChannel.send("`" + `${getAuditDate()} >>> User kicked: '${member.user.tag}' (ID: ${member.user.id}) by '${executor.tag}' (ID: ${executor.id})${reason ? ". Reason: " + reason : ""}` + "`")

		};
		*/

	} catch (error) {
        
        console.warn(error);
    
    }
}