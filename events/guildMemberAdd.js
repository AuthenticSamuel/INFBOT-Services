const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

/**
 * ! Handle sending welcome messages & roles
 */

module.exports = async (member, client) => {
	const welcomeChannelId = client.guildConfig.get(member.guild.id)[0];
	const joinRole = client.guildConfig.get(member.guild.id)[4];
	if (welcomeChannelId === "None" && joinRole === "None") return;
	try {
		if (welcomeChannelId !== "None") {
			const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
			const embed = new MessageEmbed()
				.setColor(config.COLOR.EVENT)
				.setThumbnail(member.user.avatarURL())
				.setTitle("New member!")
				.setDescription(`Welcome <@${member.id}> to **${member.guild.name}**!`);
			await welcomeChannel.send({ embeds: [embed] });
		}

		if (joinRole !== "None") {
			const role = member.guild.roles.cache.get(joinRole);
			member.roles.add(role);
		}
	} catch {console.error}
}