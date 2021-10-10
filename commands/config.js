const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");
const config = require("../config.json");
const logEvent = require("../functions/logEvent");

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("config")
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
            .setName("remove")
            .setDescription("Remove an INFBOT integration.")
            .addStringOption(option => option
                .setName("type")
                .setDescription("What do you want to remove?")
                .setRequired(true)
                .addChoice("Members (Join/Leave)", "mlc")       // REMOVE/mlc
                .addChoice("Nitro Boosts", "nbc")               // REMOVE/nbc
                .addChoice("Audit Log", "alc")))                // REMOVE/alc
        

    , async execute(interaction) {

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {

            let embed = new MessageEmbed()
                .setColor(config.COLOR.WARNING)
                .setTitle("You need to have `ADMINISTRATOR` permissions to execute this command.");
            await interaction.reply({ embeds: [embed]});
            logEvent(interaction.commandName, "ERROR: PERMS");
            return;

        };

        let subcommand = interaction.options.getSubcommand();
        let connection = interaction.client.connection;


        if (subcommand === "channel") {

            let type = interaction.options.getString("type");
            let channel = interaction.options.getChannel("target");

            if (channel.type !== "GUILD_TEXT") {

                let embed = new MessageEmbed()
                    .setColor(config.COLOR.WARNING)
                    .setTitle("Invalid channel type")
                    .setDescription("Please select a valid text channel.");
                await interaction.reply({ embeds: [embed] });
                logEvent(interaction.commandName, "WARN: TYPE");
                return;

            };

            if (type === "mlc") {

                await connection.query(
                    `
                    UPDATE guilds
                    SET welcomeChannelId = '${channel.id}'
                    WHERE guildId = '${interaction.guild.id}'
                    `
                );

                updateConfig(interaction, 0, channel.id);

                let embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("`Member Log` integration has been updated.")
                    .setDescription(`Channel: <#${channel.id}>`);
                await interaction.reply({ embeds: [embed] });
                logEvent(interaction.commandName, "SUCCESS: MLC");
                return;

            } else if (type === "nbc") {

                await connection.query(
                    `
                    UPDATE guilds
                    SET boostChannelId = '${channel.id}'
                    WHERE guildId = '${interaction.guild.id}'
                    `
                );

                updateConfig(interaction, 1, channel.id);

                let embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("`Nitro Boosts` integration has been updated.")
                    .setDescription(`Channel: <#${channel.id}>`);
                await interaction.reply({ embeds: [embed] });
                logEvent(interaction.commandName, "SUCCESS: NBC");
                return;

            } else if (type === "alc") {

                await connection.query(
                    `
                    UPDATE guilds
                    SET auditChannelId = '${channel.id}'
                    WHERE guildId = '${interaction.guild.id}'
                    `
                );

                updateConfig(interaction, 2, channel.id);

                let embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("`Audit Log` integration has been updated.")
                    .setDescription(`Channel: <#${channel.id}>`);
                await interaction.reply({ embeds: [embed] });
                logEvent(interaction.commandName, "SUCCESS: ALC");
                return;

            }

        }

        
        
        else if (subcommand === "remove") {

            let type = interaction.options.getString("type");

            if (type === "mlc") {

                await connection.query(
                    `
                    UPDATE guilds
                    SET welcomeChannelId = 'None'
                    WHERE guildId = '${interaction.guild.id}'
                    `
                );

                updateConfig(interaction, 0, "None");

                let embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Welcome Channel` integration removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(interaction.commandName, "SUCCESS: MLC");
                return;

            } else if (type === "nbc") {

                await connection.query(
                    `
                    UPDATE guilds
                    SET boostChannelId = 'None'
                    WHERE guildId = '${interaction.guild.id}'
                    `
                );

                updateConfig(interaction, 1, "None");

                let embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Nitro Boost` integration removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(interaction.commandName, "SUCCESS: NBC");
                return;

            } else if (type === "alc") {

                await connection.query(
                    `
                    UPDATE guilds
                    SET auditChannelId = 'None'
                    WHERE guildId = '${interaction.guild.id}'
                    `
                );

                updateConfig(interaction, 2, "None");

                let embed = new MessageEmbed()
                    .setColor(config.COLOR.EVENT)
                    .setTitle("INFBOT's `Audit Log` integration removed.");
                await interaction.reply({ embeds: [embed] });
                logEvent(interaction.commandName, "SUCCESS: ALC");
                return;

            }

        };

    },

};

function updateConfig(interaction, index, value) {

    let guildConfigArr = interaction.client.guildConfig.get(interaction.guild.id);
    guildConfigArr[index] = value.toString();
    interaction.client.guildConfig.set(interaction.guild.id, guildConfigArr);

};