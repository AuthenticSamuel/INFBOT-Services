const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = async (member, client) => {

	let welcomeChannelId = client.guildConfig.get(member.guild.id)[0];
	if (welcomeChannelId === "None") return;
	try {

		let welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
		let embed = new MessageEmbed()
			.setColor(config.COLOR.WARNING)
			.setThumbnail(member.user.avatarURL())
			.setTitle("Member left the server.")
			.setDescription(`<@${member.id}> has left **${member.guild.name}**.`);
		await welcomeChannel.send({ embeds: [embed] });

	} catch (error) {

		console.error(error);
		
	};

};