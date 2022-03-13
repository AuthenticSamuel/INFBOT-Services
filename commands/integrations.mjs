import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions, MessageEmbed } from "discord.js";

import DB from "../database/db.mjs";
import { config, logEvent } from "../modules/modules.mjs";

/**
 * ! Handle integrations
 */

export default {
    data: new SlashCommandBuilder()
        .setName("integrations")
        .setDescription("Change INFBOT Utilties' settings")
        .addSubcommand(subcommand => subcommand
            .setName("channel")
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

                await DB.guilds.integrations.channels.welcome.set(guild.id, channel.id);
                interaction.client.guildConfig[interaction.guild.id].channels.welcome = channel.id;

                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("`Member Log` integration has been updated.")
                    .setDescription(`Channel: <#${channel.id}>`);
                await interaction.reply({ embeds: [embed] });
                logEvent(csc, "SUCCESS: MLC");
                return;

            } else if (type === "nbc") {

                await DB.guilds.integrations.channels.boost.set(guild.id, channel.id);
                interaction.client.guildConfig[interaction.guild.id].channels.boost = channel.id;

                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("`Nitro Boosts` integration has been updated.")
                    .setDescription(`Channel: <#${channel.id}>`);
                await interaction.reply({ embeds: [embed] });
                logEvent(csc, "SUCCESS: NBC");
                return;

            } else if (type === "alc") {

                await DB.guilds.integrations.channels.audit.set(guild.id, channel.id);
                interaction.client.guildConfig[interaction.guild.id].channels.audit = channel.id;

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

            await DB.guilds.integrations.roles.newMember.set(guild.id, role.id);
            interaction.client.guildConfig[interaction.guild.id].roles.newMember = role.id;

            const joinRoleEmbed = new MessageEmbed()
                .setTitle("`Join Role` integration has been updated.")
                .setDescription(`Role: <@&${role.id}>`)
                .setColor(config.COLOR.EVENT);
            await interaction.reply({ embeds: [joinRoleEmbed], components: [] });
            logEvent(csc, "SUCCESS: JR");
            return;

        }

        //* INFBOT Voice Channels
        else if (subcommand === "autovoicechannels") {

            let { channel, category } = (await DB.guilds.integrations.voice.get(guild.id)).response;

            if (channel !== null && category !== null) {

                const ivcEmbed = new MessageEmbed()
                    .setTitle("INFBOT Voice Channels are already setup on this server.")
                    .setColor(config.COLOR.WARNING);
                interaction.reply({ embeds: [ivcEmbed] });
                logEvent(csc, "WARN: ACTIVE");
                return;

            } else if (channel === null && category === null) {

                try {

                    await guild.channels.create(config.AUTO_VC.CATEGORY_NAME, {
                        type: "GUILD_CATEGORY",
                    }).then(async c => category = c.id);

                    await guild.channels.create(config.AUTO_VC.CHANNEL_NAME, {
                        type: "GUILD_VOICE",
                        parent: category,
                    }).then(async c => channel = c.id);

                    await DB.guilds.integrations.voice.set(guild.id, channel, category);
                    client.guildConfig[guild.id].voice.channel = channel;
                    client.guildConfig[guild.id].voice.category = category;

                    logEvent(csc, "SUCCESS");
                    const ivcEmbed = new MessageEmbed()
                        .setTitle("`Automatic Voice Channels` integration activated.")
                        .setDescription(`Enter the \`${config.AUTO_VC.CHANNEL_NAME}\` channel to get started.`)
                        .setColor(config.COLOR.EVENT);
                    interaction.reply({ embeds: [ivcEmbed] });
                    return;

                } catch (error) {

                    console.warn(error);

                }

            } else {

                await DB.guilds.integrations.voice.set(guild.id);
                await DB.voiceChannels.delete(guild.id);
                client.guildConfig[guild.id].voice.channel = null;
                client.guildConfig[guild.id].voice.category = null;

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

                await DB.guilds.integrations.channels.welcome.set(guild.id);
                interaction.client.guildConfig[interaction.guild.id].channels.welcome = null;

                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Welcome Channel` integration has been removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(`${command} ${subcommand}`, "SUCCESS: MLC");
                return;

            } else if (type === "nbc") {

                await DB.guilds.integrations.channels.boost.set(guild.id);
                interaction.client.guildConfig[interaction.guild.id].channels.boost = null;

                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Nitro Boost` integration has been removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(`${command} ${subcommand}`, "SUCCESS: NBC");
                return;

            } else if (type === "alc") {

                await DB.guilds.integrations.channels.audit.set(guild.id);
                interaction.client.guildConfig[interaction.guild.id].channels.audit = null;
                
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Audit Log` integration has been removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(`${command} ${subcommand}`, "SUCCESS: ALC");
                return;

            } else if (type === "jr") {

                await DB.guilds.integrations.roles.newMember.set(guild.id);
                interaction.client.guildConfig[interaction.guild.id].roles.newMember = null;
                
                const embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Join Role` integration has been removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(`${command} ${subcommand}`, "SUCCESS: JR");
                return;

            } else if (type === "ivc") {

                const { channel, category } = (await DB.guilds.integrations.voice.get(guild.id)).response;

                if (channel === null && category === null) {

                    const ivcEmbed = new MessageEmbed()
                        .setTitle("INFBOT Voice Channels aren't running on this server.")
                        .setColor(config.COLOR.EVENT);
                    interaction.reply({ embeds: [ivcEmbed] });
                    return;

                }

                await DB.guilds.integrations.voice.set(guild.id);
                interaction.client.guildConfig[interaction.guild.id].voice.channel = null;
                interaction.client.guildConfig[interaction.guild.id].voice.category = null;

                if (guild.channels.cache.find(c => c.id == channel)) guild.channels.cache.get(channel).delete();
                if (guild.channels.cache.find(c => c.id == category)) guild.channels.cache.get(category).delete(); 
                
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