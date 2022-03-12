import { MessageEmbed } from "discord.js";

import { config } from "../modules/modules.mjs";

/**
 * ! Handle sending welcome messages & roles
 */

export default async (member, client) => {

	const welcomeChannelId = client.guildConfig[member.guild.id].channels.welcome;
	const joinRoleId = client.guildConfig[member.guild.id].roles.newMember;
	if (!welcomeChannelId && !joinRoleId) return;

	try {
		
		if (welcomeChannelId) {

			const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
			const embed = new MessageEmbed()
				.setColor(config.COLOR.EVENT)
				.setThumbnail(member.user.avatarURL())
				.setTitle("New member!")
				.setDescription(`Welcome <@${member.id}> to **${member.guild.name}**!`);
			await welcomeChannel.send({ embeds: [embed] });

		}

		if (joinRoleId) {

			const joinRole = member.guild.roles.cache.get(joinRoleId);
			member.roles.add(joinRole);

		}

	} catch (error) {
        
        console.warn(error);
    
    }
}