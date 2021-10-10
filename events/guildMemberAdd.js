const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = async (member, client) => {

	let welcomeChannelId = client.guildConfig.get(member.guild.id)[0];
	if (welcomeChannelId === "None") return;
	
	try {

		let welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
		let embed = new MessageEmbed()
			.setColor(config.COLOR.EVENT)
			.setThumbnail(member.user.avatarURL())
			.setTitle("New member!")
			.setDescription(`Welcome <@${member.id}> to **${member.guild.name}**!`);
		await welcomeChannel.send({ embeds: [embed] });

	} catch (error) {

		console.error(error);
		
	};

};