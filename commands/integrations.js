const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");
const config = require("../config.json");
const logEvent = require("../functions/logEvent");

/**
 * ! Handle integrations
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName("integrations")
        .setDescription("Change INFBOT Utilties' settings")
        .addSubcommand(subcommand => subcommand
            .setName("channelbased")
            .setDescription("Change channel settings")
            .addStringOption(option => option
                .setName("type")
                .setDescription("What do you want to change?")
                .setRequired(true)
                .addChoice("Member Log (Join/Leave)", "mlc")    // CHANNEL/mlc
                .addChoice("Nitro Boosts", "nbc")               // CHANNEL/nbc
                .addChoice("Audit Log", "alc"))                 // CHANNEL/alc
            .addChannelOption(option => option
                .setName("target")
                .setDescription("Channel")
                .setRequired(true)))                            // CHANNEL/target
        .addSubcommand(subcommand => subcommand
            .setName("joinrole")
            .setDescription("Automatically add a role to a new member")
            .addRoleOption(option => option
                .setName("role")
                .setDescription("Select a role")
                .setRequired(true)))                            // JOINROLE/role
        .addSubcommand(subcommand => subcommand
            .setName("autovoicechannels")
            .setDescription("Setup INFBOT Automatic Voice Channels"))
        .addSubcommand(subcommand => subcommand
            .setName("remove")
            .setDescription("Remove an INFBOT integration.")
            .addStringOption(option => option
                .setName("type")
                .setDescription("What do you want to remove?")
                .setRequired(true)
                .addChoice("Members (Join/Leave)", "mlc")       // REMOVE/mlc
                .addChoice("Nitro Boosts", "nbc")               // REMOVE/nbc
                .addChoice("Audit Log", "alc")                  // REMOVE/alc
                .addChoice("Join Role", "jr")                   // REMOVE/jr
                .addChoice("Automatic Voice Channels", "ivc"))) // REMOVE/ivc
    , async execute(interaction) {

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const embed = new MessageEmbed()
                .setColor(config.COLOR.WARNING)
                .setTitle("You need to have `ADMINISTRATOR` permissions to execute this command.");
            await interaction.reply({ embeds: [embed]});
            logEvent(interaction.commandName, "ERROR: PERMS");
            return;
        }

        const command = interaction.commandName;
        const subcommand = interaction.options.getSubcommand();
        const csc = `${command} ${subcommand}`;
        const connection = interaction.client.connection;
        const guild = interaction.guild;
        const client = interaction.client;

        //* Add channel integrations
        if (subcommand === "channel") {
            const type = interaction.options.getString("type");
            const channel = interaction.options.getChannel("target");
            if (channel.type !== "GUILD_TEXT") {
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.WARNING)
                    .setTitle("Invalid channel type")
                    .setDescription("Please select a valid text channel.");
                await interaction.reply({ embeds: [embed] });
                logEvent(csc, "WARN: TYPE");
                return;
            }
            if (type === "mlc") {
                await connection.query(`UPDATE utils SET welcomeChannelId = '${channel.id}' WHERE guildId = '${interaction.guild.id}'`);
                updateConfig(interaction, 0, channel.id);
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("`Member Log` integration has been updated.")
                    .setDescription(`Channel: <#${channel.id}>`);
                await interaction.reply({ embeds: [embed] });
                logEvent(csc, "SUCCESS: MLC");
                return;
            } else if (type === "nbc") {
                await connection.query(`UPDATE utils SET boostChannelId = '${channel.id}' WHERE guildId = '${interaction.guild.id}'`);
                updateConfig(interaction, 1, channel.id);
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("`Nitro Boosts` integration has been updated.")
                    .setDescription(`Channel: <#${channel.id}>`);
                await interaction.reply({ embeds: [embed] });
                logEvent(csc, "SUCCESS: NBC");
                return;
            } else if (type === "alc") {
                await connection.query(`UPDATE utils SET auditChannelId = '${channel.id}' WHERE guildId = '${interaction.guild.id}'`);
                updateConfig(interaction, 2, channel.id);
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("`Audit Log` integration has been updated.")
                    .setDescription(`Channel: <#${channel.id}>`);
                await interaction.reply({ embeds: [embed] });
                logEvent(csc, "SUCCESS: ALC");
                return;
            }
        }

        //* Add join role integration
        else if (subcommand === "joinrole") {
            const role = interaction.options.getRole("role");
            try {
				await connection.query(`UPDATE utils SET newMemberRoleId = '${role.id}' WHERE guildId = '${interaction.guild.id}'`);
				updateConfig(interaction, 4, role.id);
				const joinRoleEmbed = new MessageEmbed()
					.setTitle("`Join Role` integration has been updated.")
					.setDescription(`Role: <@&${role.id}>`)
					.setColor(config.COLOR.EVENT);
				await interaction.reply({ embeds: [joinRoleEmbed], components: [] });
                logEvent(csc, "SUCCESS: JR");
                return;
			} catch (error) {
				console.log(error);
				const errorJoinRoleEmbed = new MessageEmbed()
					.setTitle("Something didn't work...")
					.setDescription("The developer has been notified and will get on the case ASAP.\nSorry for the inconvenience.")
					.setColor(config.COLOR.ERROR);
				await interaction.reply({ embeds: [errorJoinRoleEmbed], components: [] });
                logEvent(csc, "ERROR: JR");
                return;
			}
        }

        //* INFBOT Voice Channels
        else if (subcommand === "autovoicechannels") {
            let channelCreator;
            let channelCreatorCategory;
            await connection.query(`SELECT channelCreator, channelCreatorCategory FROM voice WHERE guildId = '${guild.id}'`).then(result => {
                channelCreator = result[0][0].channelCreator;
                channelCreatorCategory = result[0][0].channelCreatorCategory;
            });
            if (channelCreator !== "None" && channelCreatorCategory !== "None") {
                const ivcEmbed = new MessageEmbed()
                    .setTitle("INFBOT Voice Channels are already setup on this server.")
                    .setColor(config.COLOR.WARNING);
                interaction.reply({ embeds: [ivcEmbed] });
                logEvent(csc, "WARN: ACTIVE");
                return;
            } else if (channelCreator === "None" && channelCreatorCategory === "None") {
                try {
                    await guild.channels.create(
                        config.AUTO_VC.CATEGORY_NAME,
                        {
                            type: "GUILD_CATEGORY",
                        }
                    ).then(async c => {
                        await connection.query(`UPDATE voice SET channelCreatorCategory = '${c.id}' WHERE guildId = '${guild.id}'`);
                        channelCreatorCategory = c.id;
                    });
                    await guild.channels.create(
                        config.AUTO_VC.CHANNEL_NAME,
                        {
                            type: "GUILD_VOICE",
                            parent: channelCreatorCategory,
                        }
                    ).then(async c => {
                        await connection.query(`UPDATE voice SET channelCreator = '${c.id}' WHERE guildId = '${guild.id}'`);
                        channelCreator = c.id;
                    });
                    client.voiceConfig.set(guild.id, {
                        channelCreator: channelCreator,
                        channelCreatorCategory: channelCreatorCategory,
                    });
                    logEvent(csc, "SUCCESS");
                    const ivcEmbed = new MessageEmbed()
                        .setTitle("`Automatic Voice Channels` integration activated.")
                        .setDescription(`Enter the \`${config.AUTO_VC.CHANNEL_NAME}\` channel to get started.`)
                        .setColor(config.COLOR.EVENT);
                    interaction.reply({ embeds: [ivcEmbed] });
                    return;
                } catch {console.error}
            } else {
                await connection.query(`UPDATE voice SET channelCreator = 'None', channelCreatorCategory = 'None' WHERE guildId = '${guild.id}'`);
                await connection.query(`DELETE FROM voiceChannels WHERE guildId = '${guild.id}'`);
                client.voiceConfig.set(guild.id, {
                    channelCreator: "None",
                    channelCreatorCategory: "None",
                });
                const ivcEmbed = new MessageEmbed()
                    .setTitle("I've found an issue with your setup...")
                    .setDescription("It seems that INFBOT Voice Channels were partially setup on this server. This shouldn't happen. We've reset the setup process, therefore, please use `/integrations autovoicechannels` to re-initialize INFBOT Voice Channels.")
                    .setColor(config.COLOR.WARNING);
                interaction.reply({ embeds: [ivcEmbed] });
                logEvent(csc, "WARN: PARTIAL ACTIVE");
                return;
            }
        }
        
        //* Remove integrations
        else if (subcommand === "remove") {
            const type = interaction.options.getString("type");
            if (type === "mlc") {
                await connection.query(`UPDATE utils SET welcomeChannelId = 'None' WHERE guildId = '${interaction.guild.id}'`);
                updateConfig(interaction, 0, "None");
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Welcome Channel` integration has been removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(`${command} ${subcommand}`, "SUCCESS: MLC");
                return;
            } else if (type === "nbc") {
                await connection.query(`UPDATE utils SET boostChannelId = 'None' WHERE guildId = '${interaction.guild.id}'`);
                updateConfig(interaction, 1, "None");
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Nitro Boost` integration has been removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(`${command} ${subcommand}`, "SUCCESS: NBC");
                return;
            } else if (type === "alc") {
                await connection.query(`UPDATE utils SET auditChannelId = 'None' WHERE guildId = '${interaction.guild.id}'`);
                updateConfig(interaction, 2, "None");
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Audit Log` integration has been removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(`${command} ${subcommand}`, "SUCCESS: ALC");
                return;
            } else if (type === "jr") {
                await connection.query(`UPDATE utils SET newMemberRoleId = 'None' WHERE guildId = '${interaction.guild.id}'`);
                updateConfig(interaction, 4, "None");
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Join Role` integration has been removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(`${command} ${subcommand}`, "SUCCESS: JR");
                return;
            } else if (type === "ivc") {
                let channelCreator, channelCreatorCategory;
                await connection.query(`SELECT channelCreator, channelCreatorCategory FROM voice WHERE guildId = '${guild.id}'`).then(result => {
                    channelCreator = result[0][0].channelCreator;
                    channelCreatorCategory = result[0][0].channelCreatorCategory;
                });
                if (channelCreator === "None" && channelCreatorCategory === "None") {
                    const ivcEmbed = new MessageEmbed()
                        .setTitle("INFBOT Voice Channels aren't running on this server.")
                        .setColor(config.COLOR.EVENT);
                    interaction.reply({ embeds: [ivcEmbed] });
                    return;
                }
                await connection.query(`UPDATE voice SET channelCreatorCategory = 'None', channelCreator = 'None' WHERE guildId = '${guild.id}'`);
                await connection.query(`DELETE FROM voiceChannels WHERE guildId = '${guild.id}'`);
                client.voiceConfig.set(guild.id, {
                    channelCreator: "None",
                    channelCreatorCategory: "None",
                });
                if (guild.channels.cache.find((c) => c.id === channelCreator)) guild.channels.cache.get(channelCreator).delete();
                if (guild.channels.cache.find((c) => c.id === channelCreatorCategory)) guild.channels.cache.get(channelCreatorCategory).delete(); 
                const ivcEmbed = new MessageEmbed()
                    .setTitle("`Auto Voice Channels` integration has been removed.")
                    .setColor(config.COLOR.EVENT);
                interaction.reply({ embeds: [ivcEmbed] });
                logEvent(csc, "SUCCESS");
                return;
            }
        }
    }
}

function updateConfig(interaction, index, value) {
    let guildConfigArr = interaction.client.guildConfig.get(interaction.guild.id);
    guildConfigArr[index] = value.toString();
    interaction.client.guildConfig.set(interaction.guild.id, guildConfigArr);
}