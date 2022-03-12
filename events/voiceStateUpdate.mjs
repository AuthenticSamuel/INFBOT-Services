import DB from "../database/db.mjs";
import { logVoice } from "../modules/modules.mjs";

/**
 * ! Methods to create and delete channels
 */

const voiceStateUpdate = async (oldState, newState, client) => {

    if (newState.channelId === oldState.channelId) return;
    
    const { channel, category } = client.guildConfig[newState.guild.id].voice;

    if (newState.channelId === channel) {
        try {

            logVoice("creating");
            await newState.guild.channels.create(
                newState.member.user.username,
                {
                    type: "GUILD_VOICE",
                    parent: category,
                }
            ).then(async channel => {

                newState.member.voice.setChannel(channel.id);
                client.voiceChannels.push(channel.id);
                await DB.voiceChannels.add(newState.guild.id, channel.id);
                logVoice("created");

            });

        } catch (error) {

            console.warn(error);
        
        }
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
                    await DB.voiceChannels.delete(oldState.guild.id, autoChannel.id);
                    logVoice("deleted");

                } catch (error) {
                    
                    console.warn(error);
                
                }
            }
        }
    }
}

export default voiceStateUpdate;