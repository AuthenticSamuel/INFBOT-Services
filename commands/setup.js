const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const logEvent = require("../functions/logEvent");
const createEmbedError = require("../functions/createEmbedError");
const config = require("../config.json");
const wait = require("util").promisify(setTimeout);

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup INFBOT Integrations")
        .addSubcommand(subcommand => subcommand
            .setName("reactionroles")
            .setDescription("Start the setup process for reaction roles"))

    , async execute(interaction) {

        let { client, guild } = interaction;
        let connection = client.connection;
        const message = await interaction.deferReply({ fetchReply: true });

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) { // MANAGE_MESSAGES

            let embed = createEmbedError(undefined, "You need `ADMINISTRATOR` permissions to use this command.");
            return await interaction.editReply({ embeds: [embed] });

        };

        let rrChannelId;
        await connection.query(
            `
            SELECT reactionRolesId
            FROM guilds
            WHERE guildId = '${guild.id}'
            `
        ).then(result => {
            
            rrChannelId = result[0][0].reactionRolesId;

        });

        if (rrChannelId !== "None") return await interaction.editReply({ embeds: [createEmbedError(undefined, "You already have a reaction roles channel.")] });

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("yes")
                    .setLabel("Yes")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("no")
                    .setLabel("No")
                    .setStyle("DANGER"),
            );

        let embed = new MessageEmbed()
            .setTitle("Ready to set up reaction roles?")
            .setColor(config.COLOR.EVENT);
        await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = i => (i.customId === "yes" || i.customId === "no" ) && i.user.id === interaction.member.id;
        const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", filter, time: 5000, max: 1 });

        collector.on("collect", async i => {

            if (i.customId === "yes") {

                let yesEmbed = new MessageEmbed()
                    .setTitle("Great, let's get started!")
                    .setDescription("Don't worry, I'm going to be guiding you throughout the setup process.")
                    .setColor(config.COLOR.EVENT);
                await interaction.editReply({ embeds: [yesEmbed], components: [] });
                await wait(3000);
                firstSetup();

            } else if (i.customId === "no") later();

        });

        await collector.on("end", async collected => {

            if (collected.size === 0) outOfTime();

        });

        // First emote
        const firstSetup = async () => {

            let firstEmbed = new MessageEmbed()
                .setTitle("First Emote")
                .setDescription("Please react to **this message** with the first emote you want to add.")
                .setColor(config.COLOR.EVENT);
            interaction.editReply({ embeds: [firstEmbed], components: [] });

            const filter = (reaction, user) => user.id === interaction.member.user.id;
            const collector = message.createReactionCollector({ filter, time: 10000, max: 1 });

            collector.on("collect", async (reaction, user) => {

                const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
                try {
                    for (const reaction of userReactions.values()) await reaction.users.remove(user.id)
                } catch (error) {
                    console.error("Error emoji");
                }

                if (reaction.emoji.id) {

                    if (!guild.emojis.cache.has(reaction.emoji.id)) {

                        let errorEmbed = new MessageEmbed()
                            .setTitle("Unknown Emoji")
                            .setDescription("Please use only default and your server's emojis.")
                            .setColor(config.COLOR.WARNING);
                        await interaction.editReply({ embeds: [errorEmbed], components: [] });
                        await wait(5000);
                        return retry();

                    };

                };

                message.react(reaction.emoji.id || reaction.emoji.name);

                let emoteEmbed = new MessageEmbed()
                    .setTitle("Just got your first reaction!")
                    .setColor(config.COLOR.EVENT);
                await interaction.editReply({ embeds: [emoteEmbed], components: [] });
                await wait(3000);
                connectRole(reaction);

            });

            collector.on("end", async collected => {

                if (collected.size === 0) {

                    let noEmoteEmbed = new MessageEmbed()
                        .setTitle("I didn't detect a reaction...")
                        .setColor(config.COLOR.EVENT);
                    await interaction.editReply({ embeds: [noEmoteEmbed], components: [] });
                    await wait(3000);
                    await interaction.deleteReply();

                };

            }); 

        };

        // Connect a role to an emoji
        const connectRole = async (reaction) => {

            let roleEmbed = new MessageEmbed()
                .setTitle("What role do you to connect to ?")
                .setColor(config.COLOR.EVENT);
            await interaction.editReply({ embeds: [roleEmbed], components: [] });

            const filter = m => m.author.id === interaction.member.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 10000, max: 1 });

            collector.on("collect", async m => {

                m.delete();
                
                roleId = m.content;

                if (guild.roles.cache.has(roleId)) {

                    let emojiText = `${reaction.emoji.name}`;
                    if (reaction.emoji.id) emojiText = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;

                    let roleSuccessEmbed = new MessageEmbed()
                        .setTitle("Success!")
                        .setDescription(`Linked emoji ${emojiText} to <@&${roleId}>`)
                        .setColor(config.COLOR.EVENT);
                    await interaction.editReply({ embeds: [roleSuccessEmbed], components: [] });

                } else roleError(roleId);


            });

            collector.on("end", collected => {

                if (collected.size === 0) outOfTime();

            });

        };



        // Prompt retry
        const retry = async () => {

            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("yes")
                        .setLabel("Yes")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("no")
                        .setLabel("No")
                        .setStyle("DANGER"),
                );

            let retryEmbed = new MessageEmbed()
                .setTitle("Would you like to retry?")
                .setColor(config.COLOR.EVENT);
            await interaction.editReply({ embeds: [retryEmbed], components: [row] });

            const filter = i => (i.customId === "yes" || i.customId === "no" ) && i.user.id === interaction.member.id;
            const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", filter, time: 5000, max: 1 });

            collector.on("collect", async i => {

                if (i.customId === "yes") firstSetup();
                else if (i.customId === "no") later();

            });

            await collector.on("end", async collected => {

                if (collected.size === 0) outOfTime();
    
            });
            
        };

        // User out of time
        const outOfTime = async () => {

            let errorEmbed = new MessageEmbed()
                .setTitle("You ran out of time.")
                .setFooter("This message will be deleted shortly...")
                .setColor(config.COLOR.EVENT);
            await interaction.editReply({ embeds: [errorEmbed], components: [] });
            await wait(5000);
            await interaction.deleteReply();

        };

        // User decided later
        const later = async () => {

            let laterEmbed = new MessageEmbed()
                .setTitle("No problem!")
                .setDescription("Come back at any time if you want to setup reaction roles.")
                .setFooter("This message will be deleted shortly...")
                .setColor(config.COLOR.EVENT);
            await interaction.editReply({ embeds: [laterEmbed], components: [] });
            await wait(5000);
            await interaction.deleteReply();

        };

        const roleError = async (roleId) => {

            let roleErrorEmbed = new MessageEmbed()
                .setTitle("Error")
                .setDescription(`Couldn't find a role using \`${roleId}\`.\nMake sure to use a valid role ID (i.e: \`801862573112426556\`)`)
                .setColor(config.COLOR.WARNING);
            await interaction.editReply({ embeds: [roleErrorEmbed], components: [] });
            await message.reactions.removeAll();
            await wait(10000);
            retry();

        };

    },

};