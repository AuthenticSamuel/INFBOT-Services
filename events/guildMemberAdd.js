const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = async (member, client) => {

	let welcomeChannelId = client.guildConfig.get(member.guild.id)[0];
	let joinRole = client.guildConfig.get(member.guild.id)[4];
	if (welcomeChannelId === "None" && joinRole === "None") return;
	
	try {

		if (welcomeChannelId !== "None") {

			let welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
			let embed = new MessageEmbed()
				.setColor(config.COLOR.EVENT)
				.setThumbnail(member.user.avatarURL())
				.setTitle("New member!")
				.setDescription(`Welcome <@${member.id}> to **${member.guild.name}**!`);
			await welcomeChannel.send({ embeds: [embed] });

		};

		if (joinRole !== "None") {

			let role = member.guild.roles.cache.get(joinRole);
			member.roles.add(role);

		}


	} catch (error) {

		console.error(error);
		
	};

};