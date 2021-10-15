const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const auditDate = require("../functions/auditDate");

module.exports = async (member, client) => {

	let welcomeChannelId = client.guildConfig.get(member.guild.id)[0];
	let auditChannelId = client.guildConfig.get(member.guild.id)[2];
	if (welcomeChannelId === "None" && auditChannelId === "None") return;

	
	try {

		if (welcomeChannelId !== "None") {

			let welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
			let embed = new MessageEmbed()
				.setColor(config.COLOR.WARNING)
				.setThumbnail(member.user.avatarURL())
				.setTitle("Member left the server.")
				.setDescription(`<@${member.id}> has left **${member.guild.name}**.`);
			await welcomeChannel.send({ embeds: [embed] });

		};

		// // to be looked at

		// if (auditChannelId !== "None") {

		// 	let auditChannel = member.guild.channels.cache.get(auditChannelId);

		// 	const log = await member.guild.fetchAuditLogs({
		// 		limit: 1,
		// 		type: "MEMBER_KICK",
		// 	});

		// 	const kickLog = log.entries.first();
		// 	if (!kickLog) return;

		// 	const { executor, target, reason } = kickLog;

		// 	if (target.id === member.user.id) await auditChannel.send("`" + `${auditDate()} >>> User kicked: '${member.user.tag}' (ID: ${member.user.id}) by '${executor.tag}' (ID: ${executor.id})${reason ? ". Reason: " + reason : ""}` + "`")

		// };

	} catch (error) {

		console.error(error);
		
	};

};