const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const logEvent = require("../functions/logEvent");
const capitalizeFirstLetter = require("../functions/capitalizeFirstLetter");

module.exports = {

	data: new SlashCommandBuilder()
		.setName("ivc")
		.setDescription("Commands for INFBOT Voice Channels")
		.addSubcommand(subcommand => subcommand
			.setName("info")
			.setDescription("IVC Information")
			.addStringOption(option => option
				.setName("type")
				.setDescription("What do you want to know?")
				.setRequired(true)
				.addChoice("INFBOT Voice Channels (IVC) Availability", "ivca")
				.addChoice("Your channel's relevant information", "uci")))
		.addSubcommand(subcommand => subcommand
			.setName("set")
			.setDescription("Change your IVC's settings")
			.addStringOption(option => option
				.setName("setting")
				.setDescription("Setting to change")
				.setRequired(true)
				.addChoice("Bitrate (kbps)", "br")
				.addChoice("User Limit", "ul"))
			.addIntegerOption(option => option
				.setName("value")
				.setDescription("Value to set")
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName("lock")
			.setDescription("Lock/Unlock your IVC")
			.addBooleanOption(option => option
				.setName("value")
				.setDescription("Value to set")
				.setRequired(true)))


	, async execute(interaction) {

		let client = interaction.client;
		let connection = client.connection;
		let guild = interaction.guild;
		let member = interaction.member;

		let command = interaction.commandName;
		let subcommand = interaction.options.getSubcommand();
		let csc = `${command} ${subcommand}`;


		// Status information
		if (subcommand === "info") {

			let option = interaction.options.getString("type")

			if (option === "ivca") {

				let { channelCreator, channelCreatorCategory } = client.voiceConfig.get(guild.id);
				
				if (channelCreator !== "None" && channelCreatorCategory !== "None") {

					let ivcaEmbed = new MessageEmbed()
						.setTitle("INFBOT Voice Channels (IVCs) are up and running!")
						.setColor(config.COLOR.EVENT);
					await interaction.reply({ embeds: [ivcaEmbed] });
					logEvent(csc, "SUCCESS: ACTIVE");
					return;

				} else if (channelCreator === "None" && channelCreatorCategory === "None") {

					let ivcaEmbed = new MessageEmbed()
						.setTitle("INFBOT Voice Channels (IVCs) aren't running on this server.")
						.setDescription("If you're an admin, use `/integrations autovoicechannels` to initialize INFBOT Voice Channels.")
						.setColor(config.COLOR.EVENT);
					await interaction.reply({ embeds: [ivcaEmbed] });
					logEvent(csc, "SUCCESS: INACTIVE");
					return;

				} else {

					await connection.query(
						`
						UPDATE voice
						SET channelCreator = 'None',
							channelCreatorCategory = 'None'
						WHERE guildId = '${guild.id}'
						`
					);

					await connection.query(
						`
						DELETE
						FROM voiceChannels
						WHERE guildId = '${guild.id}'
						`
					);

					client.voiceConfig.set(guild.id, {
						channelCreator: "None",
						channelCreatorCategory: "None",
					});

					let ivcaEmbed = new MessageEmbed()
						.setTitle("I've found an issue with your setup...")
						.setDescription("It seems that INFBOT Voice Channels were partially setup on this server. This shouldn't happen. We've reset the setup process, therefore, please use `/config autovoicechannels` to re-initialize INFBOT Voice Channels.")
						.setColor(config.COLOR.WARNING);
					interaction.reply({ embeds: [ivcaEmbed] });
					logEvent(csc, "WARN: PARTIAL ACTIVE");
					return;

				};

			} else if (option === "uci") {

				if (!member.voice.channel) {

					let uciEmbed = new MessageEmbed()
						.setTitle("You need to be in a voice channel.")
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [uciEmbed] });
					logEvent(csc, "WARN: NO VC");
					return;

				};

				let channel = member.voice.channel;
				let userLimit = channel.userLimit === 0 ? "Unlimited" : channel.userLimit;
				
				let uciEmbed = new MessageEmbed()
					.setTitle("Here's some information about your voice channel.")
					.addFields(
						{ name: "Name:", value: `${channel.name}`, inline: true },
						{ name: "ID:", value: `${channel.id}`, inline: true },
						{ name: "\u200b", value: "\u200b", inline: true},
						{ name: "Bitrate:", value: `${Math.round(channel.bitrate / 1000)}kbps`, inline: true},
						{ name: "User Limit:", value: `${userLimit}`, inline: true},
						{ name: "IVC:", value: `${capitalizeFirstLetter(client.voiceChannels.includes(channel.id) + "")}`, inline: true},
					)
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [uciEmbed] });
				logEvent(csc)
				return;

			}

		} else if (subcommand === "set") {

			let optionString = interaction.options.getString("setting");
			let optionInt = interaction.options.getInteger("value");

			if (optionString === "br") {

				if (!member.voice.channel || !client.voiceChannels.includes(member.voice.channel.id)) {

					let brEmbed = new MessageEmbed()
						.setTitle("Warning!")
						.setDescription("You need to be in an INFBOT Voice Channel (IVC).")
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [brEmbed] });
					logEvent(csc, "WARN: NOT IN IVC");
					return;

				};

				let maxBitrate = 96;
				switch (guild.premiumTier) {
					case "NONE": break;
					case "TIER_1": maxBitrate = 128; break;
					case "TIER_2": maxBitrate = 256; break;
					case "TIER_3": maxBitrate = 384; break;
				};

				if (optionInt < 8 || optionInt > maxBitrate) {

					let brEmbed = new MessageEmbed()
						.setTitle("Warning!")
						.setDescription(`Please provide a valid bitrate.\n\nThe bitrate is a number between \`8\`kbps and \`${maxBitrate}\`kbps.`)
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [brEmbed] });
					logEvent(csc, "WARN: OUT OF RANGE");
					return;

				};

				await member.voice.channel.setBitrate(Math.round(optionInt) * 1000);

				let brEmbed = new MessageEmbed()
					.setTitle(`Your channel's bitrate is now set to ${member.voice.channel.bitrate / 1000}kbps.`)
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [brEmbed] });
				logEvent(csc, `SUCCESS: ${member.voice.channel.bitrate / 1000}KBPS`);
				return;

			} else if (optionString === "ul") {

				if (!member.voice.channel || !client.voiceChannels.includes(member.voice.channel.id)) {

					let ulEmbed = new MessageEmbed()
						.setTitle("Warning!")
						.setDescription("You need to be in an INFBOT Voice Channel (IVC).")
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [ulEmbed] });
					logEvent(csc, "WARN: NOT IN IVC");
					return;

				};

				if (optionInt < 0 || optionInt > 99) {

					let ulEmbed = new MessageEmbed()
						.setTitle("Warning!")
						.setDescription(`Please provide a valid userlimit.\n\nThe userlimit is a number between \`0\` (unlimited) and \`99\` users.`)
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [ulEmbed] });
					logEvent(csc, "WARN: OUT OF RANGE");
					return;

				};

				await member.voice.channel.setUserLimit(optionInt);

				
				let userLimit = "";
				if (member.voice.channel.userLimit == 0) userLimit = "an unlimited amount of users";
				else if (member.voice.channel.userLimit == 1) userLimit = "1 user";
				else userLimit = `${member.voice.channel.userLimit} users`;
				
				let ulEmbed = new MessageEmbed()
					.setTitle(`Your channel's userlimit is now set to ${userLimit}.`)
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [ulEmbed] });
				logEvent(csc, `SUCCESS: ${member.voice.channel.userLimit} USERS`);
				return;

			};


		} else if (subcommand === "lock") {

			let option = interaction.options.getBoolean("value");

			if (!member.voice.channel || !client.voiceChannels.includes(member.voice.channel.id)) {

				let lockEmbed = new MessageEmbed()
					.setTitle("Warning!")
					.setDescription("You need to be in an INFBOT Voice Channel (IVC).")
					.setColor(config.COLOR.WARNING);
				await interaction.reply({ embeds: [lockEmbed] });
				logEvent(csc, "WARN: NOT IN IVC");
				return;

			};

			if (option) {
	
				await guild.channels.cache.get(member.voice.channel.id).permissionOverwrites.edit(
					guild.id, {
						CONNECT: false,
					},
				);
	
				let lockEmbed = new MessageEmbed()
					.setTitle("You've successfully locked your channel.")
					.setDescription(`Use \`/ivc lock false\` to unlock it.`)
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [lockEmbed] });
				logEvent(csc, "SUCCESS");
				return;

			} else {				
	
				await guild.channels.cache.get(member.voice.channel.id).permissionOverwrites.edit(
					guild.id, {
						CONNECT: true,
					},
				);
	
				let lockEmbed = new MessageEmbed()
					.setTitle("You've successfully unlocked your channel.")
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [lockEmbed] });
				logEvent(csc, "SUCCESS");
				return;

			};

		};

	},

};