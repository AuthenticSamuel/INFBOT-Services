const logVoice = require("../functions/logVoice");

/**
 * ! Methods to create and delete channels
 */

module.exports = async (oldState, newState, client) => {
    if (newState.channelId === oldState.channelId) return;
    const connection = client.connection;
    const { channelCreator, channelCreatorCategory } = client.voiceConfig.get(newState.guild.id);

    if (newState.channelId === channelCreator) {
        try {
            logVoice("creating");
            await newState.guild.channels.create(
                newState.member.user.username,
                {
                    type: "GUILD_VOICE",
                    parent: channelCreatorCategory,
                }
            ).then(async channel => {
                newState.member.voice.setChannel(channel.id);
                client.voiceChannels.push(channel.id);
                await connection.query(`INSERT INTO voiceChannels (guildId, channelId) VALUES ('${newState.guild.id}', '${channel.id}')`);
            });
            logVoice("created");
        } catch {console.error}
    }

    const autoChannels = client.voiceChannels;

    for (const autoChannelId of autoChannels) {
        if (oldState.channelId === autoChannelId) {
            const autoChannel = oldState.guild.channels.cache.get(autoChannelId);
            if (autoChannel.members.size < 1) {
                try {
                    logVoice("deleting");
                    autoChannel.delete();
                    client.voiceChannels = client.voiceChannels.filter(channel => channel !== autoChannel.id);
                    await connection.query(`DELETE FROM voiceChannels WHERE channelId = '${autoChannel.id}'`);
                    logVoice("deleted");
                } catch {console.error}
            }
        }
    }
}