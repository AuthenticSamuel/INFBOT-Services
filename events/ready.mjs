import chalk from "chalk";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { readFile } from "fs/promises";

import { newGuild, fetchGuildInfo, fetchVoiceChannelInfo } from "../database/db.mjs";
import { getDateTime } from "../modules/modules.mjs";
import config from "../config.js";

const packageJSON = JSON.parse(await readFile("./package.json"));

/**
 * ! Stuff for when the bot is online and ready
 */

const ready = async client => {
    const commands = client.commandsArray;
    let totalMembers = 0;
    let allGuildInfo = [];

    class Server {
        constructor(id, name, members) {
            this.Guild_ID = id;
            this.Guild_Name = name;
            this.Members = members;
        }
    }

    client.guilds.cache.forEach(async guild => {
        if (guild.memberCount != NaN) totalMembers += guild.memberCount;
        allGuildInfo.push(new Server(guild.id, guild.name, guild.memberCount));
        guild.members.fetch();

        /**
         * ! Commented code below for first startup only
         * ! Initial database setup for already existing guilds
         */

        // newGuild(guild.id);
    });

    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_AUTH_TOKEN);

    try {
        if (!config.guildId) await rest.put(Routes.applicationGuildCommands(client.user.id), { body: commands },);
        else await rest.put(Routes.applicationGuildCommands(client.user.id, config.guildId), { body: commands },);
        console.log(`${chalk.cyan(`${getDateTime()} >>> Slash commands have been registered`)}`);
    } catch (error) {
        console.log(`${chalk.red(`${getDateTime()} >>> Slash commands have not been registered`)}`);
        console.error(error);
    }

    client.guilds.cache.forEach(async guild => {
        await fetchGuildInfo(guild.id).then(data => {
            client.guildConfig[guild.id] = {
                integrations: {
                    voice: {
                        channel: data.integrations.voice.channel,
                        category: data.integrations.voice.category,
                    },
                    channels: {
                        welcome: data.integrations.channels.welcome,
                        boost: data.integrations.channels.boost,
                        audit: data.integrations.channels.audit,
                    },
                    roles: {
                        newMember: data.integrations.roles.newMember,
                    },
                },
            }
        });

        await fetchVoiceChannelInfo(guild.id).then(data => {
            for (const voiceChannel of data) client.voiceChannels.push(voiceChannel.channelId);
        });
    });
    console.log(`${chalk.cyan(`${getDateTime()} >>> Database fetch successful`)}`);
    
    console.log(`${chalk.cyan(`${getDateTime()} >>> INFBOT Services ${chalk.white(packageJSON["version"])} Online • ${chalk.white(client.guilds.cache.size)} guilds • ${chalk.white(client.guilds.cache.reduce((a, b) => a.memberCount + b.memberCount))} members`)}`);
    console.table(allGuildInfo, ["Guild_ID", "Guild_Name", "Members"]);

    const status = [
        `out for / commands!`,
        `${client.guilds.cache.size} servers`,
        `${totalMembers} users`,
    ];

    let x = 0;
    setInterval(() => {

        client.user.setActivity(status[x], {type: "WATCHING"});
        x++;
        if (x == status.length) x = 0;

    }, config.DELAY.STATUS)
}

export default ready;