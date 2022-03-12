import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

import config from "../config.js";
import { delVoiceChannel, fetchVoiceChannelInfo, updateGuild, updateVoiceChannel } from "../database/db.mjs";
import { logEvent, capitalizeFirstLetter } from "../modules/modules.mjs";

/**
 * ! Handle INFBOT VOICE CHANNELS (IVC) commands
 */

const command = {
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
		.addSubcommand(subcommand => subcommand
			.setName("adduser")
			.setDescription("Invite a user to your private IVC")
			.addUserOption(option => option
				.setName("user")
				.setDescription("User to invite")
				.setRequired(true)))

	, async execute(interaction) {

		const client = interaction.client;
		const guild = interaction.guild;
		const member = interaction.member;
		const command = interaction.commandName;
		const subcommand = interaction.options.getSubcommand();
		const csc = `${command} ${subcommand}`;

		//* Status information
		if (subcommand === "info") {
			const option = interaction.options.getString("type")

			if (option === "ivca") {
				const { channel, category } = client.guildConfig[guild.id].integrations.voice;
				if (channel !== null && category !== null) {
					const ivcaEmbed = new MessageEmbed()
						.setTitle("INFBOT Voice Channels (IVCs) are up and running!")
						.setColor(config.COLOR.EVENT);
					await interaction.reply({ embeds: [ivcaEmbed] });
					logEvent(csc, "SUCCESS: ACTIVE");
					return;
				} else if (channel === null && category === null) {
					const ivcaEmbed = new MessageEmbed()
						.setTitle("INFBOT Voice Channels (IVCs) aren't running on this server.")
						.setDescription("If you're an admin, use `/integrations autovoicechannels` to initialize INFBOT Voice Channels.")
						.setColor(config.COLOR.EVENT);
					await interaction.reply({ embeds: [ivcaEmbed] });
					logEvent(csc, "SUCCESS: INACTIVE");
					return;
				} else {
					await updateGuild(guild.id, {
						integrations: {
							voice: {
								channel: null,
								category: null,
							},
						},
					});
					delVoiceChannel(guild.id);
					client.guildConfig[guild.id].integrations.voice.channel = null;
					client.guildConfig[guild.id].integrations.voice.category = null;

					const ivcaEmbed = new MessageEmbed()
						.setTitle("I've found an issue with your setup...")
						.setDescription("It seems that INFBOT Voice Channels were partially setup on this server. This shouldn't happen. We've reset the setup process, therefore, please use `/config autovoicechannels` to re-initialize INFBOT Voice Channels.")
						.setColor(config.COLOR.WARNING);
					interaction.reply({ embeds: [ivcaEmbed] });
					logEvent(csc, "WARN: PARTIAL ACTIVE");
					return;
				}
			} else if (option === "uci") {
				if (!member.voice.channel) {
					const uciEmbed = new MessageEmbed()
						.setTitle("You need to be in a voice channel.")
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [uciEmbed] });
					logEvent(csc, "WARN: NO VC");
					return;
				}

				const channel = member.voice.channel;
				const userLimit = channel.userLimit === 0 ? "Unlimited" : channel.userLimit;
				const uciEmbed = new MessageEmbed()
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
				logEvent(csc);
				return;
			}
		} else if (subcommand === "set") {
			const optionString = interaction.options.getString("setting");
			const optionInt = interaction.options.getInteger("value");
			if (optionString === "br") {
				if (!member.voice.channel || !client.voiceChannels.includes(member.voice.channel.id)) {
					const brEmbed = new MessageEmbed()
						.setTitle("Warning!")
						.setDescription("You need to be in an INFBOT Voice Channel (IVC).")
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [brEmbed] });
					logEvent(csc, "WARN: NOT IN IVC");
					return;
				}
				const getMaxBitrate = (inputTier) => {
					switch (inputTier) {
						case "NONE": return 96;
						case "TIER_1": return 128;
						case "TIER_2": return 256;
						case "TIER_3": return 384;
					}
				}
				const maxBitrate = getMaxBitrate(guild.premiumTier);
				if (optionInt < 8 || optionInt > maxBitrate) {
					const brEmbed = new MessageEmbed()
						.setTitle("Warning!")
						.setDescription(`Please provide a valid bitrate.\n\nThe bitrate is a number between \`8\`kbps and \`${maxBitrate}\`kbps.`)
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [brEmbed] });
					logEvent(csc, "WARN: OUT OF RANGE");
					return;
				}
				await member.voice.channel.setBitrate(Math.round(optionInt) * 1000);
				const brEmbed = new MessageEmbed()
					.setTitle(`Your channel's bitrate is now set to ${member.voice.channel.bitrate / 1000}kbps.`)
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [brEmbed] });
				logEvent(csc, `SUCCESS: ${member.voice.channel.bitrate / 1000}KBPS`);
				return;
			} else if (optionString === "ul") {
				if (!member.voice.channel || !client.voiceChannels.includes(member.voice.channel.id)) {
					const ulEmbed = new MessageEmbed()
						.setTitle("Warning!")
						.setDescription("You need to be in an INFBOT Voice Channel (IVC).")
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [ulEmbed] });
					logEvent(csc, "WARN: NOT IN IVC");
					return;
				}
				if (optionInt < 0 || optionInt > 99) {
					const ulEmbed = new MessageEmbed()
						.setTitle("Warning!")
						.setDescription(`Please provide a valid userlimit.\n\nThe userlimit is a number between \`0\` (unlimited) and \`99\` users.`)
						.setColor(config.COLOR.WARNING);
					await interaction.reply({ embeds: [ulEmbed] });
					logEvent(csc, "WARN: OUT OF RANGE");
					return;
				}
				await member.voice.channel.setUserLimit(optionInt);

				const getUserLimitString = (userLimit) => {
					switch (userLimit) {
						case 0: return "an unlimited amount of users";
						case 1: return "1 user";
						default: return `${userLimit} users`;
					}
				}
				const userLimit = getUserLimitString(member.voice.channel.userLimit);
				const ulEmbed = new MessageEmbed()
					.setTitle(`Your channel's userlimit is now set to ${userLimit}.`)
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [ulEmbed] });
				logEvent(csc, `SUCCESS: ${member.voice.channel.userLimit} USERS`);
				return;
			}
		} else if (subcommand === "lock") {
			const option = interaction.options.getBoolean("value");
			if (!member.voice.channel || !client.voiceChannels.includes(member.voice.channel.id)) {
				const lockEmbed = new MessageEmbed()
					.setTitle("Warning!")
					.setDescription("You need to be in an INFBOT Voice Channel (IVC).")
					.setColor(config.COLOR.WARNING);
				await interaction.reply({ embeds: [lockEmbed] });
				logEvent(csc, "WARN: NOT IN IVC");
				return;
			}
			if (option) {
				const channel = guild.channels.cache.get(member.voice.channel.id);
				await channel.permissionOverwrites.edit(
					guild.id, {
						CONNECT: false,
					},
				);
				let users = [];
				for (const user of channel.members) {
					users.push(user[1].user.id);
					await channel.permissionOverwrites.edit(
						user[1].user, {
							CONNECT: true,	
						},
					);
				}
				await updateVoiceChannel(guild.id, channel.id, {
					invitedUsers: users,
				});
				const lockEmbed = new MessageEmbed()
					.setTitle("You've successfully locked your channel.")
					.setDescription(`Use \`/ivc lock false\` to unlock it.`)
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [lockEmbed] });
				logEvent(csc, "SUCCESS");
				return;
			} else {
				const channel = guild.channels.cache.get(member.voice.channel.id);
				await channel.permissionOverwrites.edit(
					guild.id, {
						CONNECT: true,
					},
				);
				await fetchVoiceChannelInfo(guild.id, channel.id).then(async voiceChannel => {
					for (const userId of voiceChannel.invitedUsers) {
						await channel.permissionOverwrites.edit(
							userId, {
								CONNECT: null,
							},
						);
					}
				});
				await updateVoiceChannel(guild.id, channel.id, {
					invitedUsers: [],
				});

				const lockEmbed = new MessageEmbed()
					.setTitle("You've successfully unlocked your channel.")
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [lockEmbed] });
				logEvent(csc, "SUCCESS");
				return;
			};
		} /* else if (subcommand === "adduser") {

			// const user = interaction.options.getUser("user");
			
			// let lockEmbed = new MessageEmbed()
			// 	.setTitle("User invited to channel.")
			// 	.setDescription(`User: @${user}`)
			// 	.setColor(config.COLOR.EVENT);
			// await interaction.reply({ embeds: [lockEmbed] });
			// logEvent(csc, "SUCCESS");
			// return;

		} */
	}
}

export default command;