const logVoice = require("../functions/logVoice");

module.exports = async (oldState, newState, client) => {

    if (newState.channelId === oldState.channelId) return;

    let connection = client.connection;

    let { channelCreator, channelCreatorCategory } = client.voiceConfig.get(newState.guild.id);

    if (newState.channelId === channelCreator) {

        try {

            logVoice("creating");

            await newState.guild.channels.create(
                newState.member.user.username,
                {
                    type: "GUILD_VOICE",
                    parent: channelCreatorCategory,
                }
            ).then(async c => {

                newState.member.voice.setChannel(c.id);
                client.voiceChannels.push(c.id);

                await connection.query(
                    `
                    INSERT INTO voiceChannels (guildId, channelId)
                    VALUES ('${newState.guild.id}', '${c.id}')
                    `
                );

            });


            logVoice("created");

        } catch (error) {

            console.error(error);

        };

    };

    let autoChannels = client.voiceChannels;

    for (let i = 0; i < autoChannels.length; i++) {

        if (oldState.channelId === autoChannels[i]) {

            let autoChannel = oldState.guild.channels.cache.get(autoChannels[i]);

            if (autoChannel.members.size < 1) {

                logVoice("deleting");

                try {

                    autoChannel.delete();
                    client.voiceChannels = client.voiceChannels.filter(c => c !== autoChannel.id);

                    await connection.query(
                        `
                        DELETE
                        FROM voiceChannels
                        WHERE channelId = '${autoChannel.id}'
                        `
                    );

                } catch (error) {

                    console.error(error);
                    
                };

                logVoice("deleted");

            };

        };

    };

};