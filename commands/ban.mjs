import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

import { config, logEvent } from "../modules/modules.mjs";

export default {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban a user")
		.addUserOption(option => option
			.setName("target")
			.setDescription("User to ban")
			.setRequired(true))
		.addStringOption(option => option
			.setName("reason")
			.setDescription("Reason (optional)")
			.setRequired(false))
			
	, async execute(interaction) {

		const client = interaction.client;
		const guild = interaction.guild;
		const initMember = interaction.member;
		const targetMember = guild.members.cache.get(interaction.options.getUser("target").id);
		const reason = interaction.options.getString("reason") || "No reason provided";

		await interaction.deferReply({ ephemeral: true })

		if (!initMember.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			const embed = new MessageEmbed()
				.setColor(config.COLOR.WARNING)
				.setTitle("You need to have the `BAN_MEMBERS` permission to execute this command.");
			await interaction.editReply({ embeds: [embed] });
			logEvent(interaction.commandName, "WARN: PERMS");
			return;
		}

		if (!guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			const embed = new MessageEmbed()
				.setColor(config.COLOR.ERROR)
				.setTitle("INFBOT Services does not have the `BAN_MEMBERS` permission, which is required to execute this command.");
			await interaction.editReply({ embeds: [embed] });
			logEvent(interaction.commandName, "ERROR: SELF PERMS");
			return;
		}

		if (initMember.roles.highest.position < targetMember.roles.highest.position && !initMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			const embed = new MessageEmbed()
				.setColor(config.COLOR.WARNING)
				.setTitle("This user's role is higher than yours, and therefore cannot be banned by you.");
			await interaction.editReply({ embeds: [embed] });
			logEvent(interaction.commandName, "WARN: TARGET PERMS HIGHER");
			return;
		}

		if (guild.me.roles.highest.position < targetMember.roles.highest.position && !initMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			const embed = new MessageEmbed()
				.setColor(config.COLOR.WARNING)
				.setTitle("This user's role is higher than mine, therefore I cannot ban them.");
			await interaction.editReply({ embeds: [embed] });
			logEvent(interaction.commandName, "WARN: TARGET PERMS HIGHER");
			return;
		}

		if (initMember === targetMember) {
			const embed = new MessageEmbed()
				.setColor(config.COLOR.WARNING)
				.setTitle("Sorry, but you can't ban yourself...");
			await interaction.editReply({ embeds: [embed] });
			logEvent(interaction.commandName, "WARN: SELF TARGET");
			return;
		}

		if (targetMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || !targetMember.bannable) {
			const embed = new MessageEmbed()
				.setColor(config.COLOR.WARNING)
				.setTitle("This user is a server admin or unbannable.");
			await interaction.editReply({ embeds: [embed] });
			logEvent(interaction.commandName, "WARN: TARGET ADMIN");
			return;
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("confirm")
					.setLabel("Confirm")
					.setStyle("SUCCESS"),
				new MessageButton()
					.setCustomId("cancel")
					.setLabel("Cancel")
					.setStyle("DANGER")
			);

		const embed = new MessageEmbed()
			.setColor(config.COLOR.INPUT)
			.setTitle("Confirmation")
			.setDescription(`You are about to ban ${targetMember.toString()}\nFor:\nReason: \`${reason}\``);
		await interaction.editReply({ components: [row], embeds: [embed], ephemeral: true });
		
		const filter = i => i.customId === "confirm" || i.customId === "cancel" && i.user.id === initMember.id;
		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 10000,
			max: 1
		});

		collector.on("collect", async i => {
			await i.deferReply({ ephemeral: true });
			if (i.customId === "confirm") {
				try {
					await targetMember.ban({ reason }).then(async () => {
						const embed = new MessageEmbed()
							.setColor(config.COLOR.SUCCESS)
							.setTitle("Success!")
							.setDescription(`${targetMember.toString()} has been banned.\nReason: \`${reason}\``);
						await i.followUp({
							embeds: [embed],
							ephemeral: false
						});
						logEvent(interaction.commandName, "SUCCESS");
					});
				} catch (error) {
					const embed = new MessageEmbed()
						.setColor(config.COLOR.ERROR)
						.setTitle("There's been an error processing that ban...")
					await i.editReply({
						embeds: [embed]
					});
					logEvent(interaction.commandName, "ERROR");
				}
			} else {
				const embed = new MessageEmbed()
					.setColor(config.COLOR.WARNING)
					.setTitle("Command Aborted")
				await i.editReply({
					embeds: [embed]
				});
			}
		});
	}
}