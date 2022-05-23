import chalk from "chalk";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import DB from "../database/db.mjs";
import {config, packageJSON, getDateTime } from "../modules/modules.mjs";

/**
 * ! Stuff for when the bot is online and ready
 */

export default async client => {
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

        // await DB.guilds.add(guild.id);

    });

    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_AUTH_TOKEN);

    try {

        // if (!config.guildId)
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands },);
        // else await rest.put(Routes.applicationGuildCommands(client.user.id, config.guildId), { body: commands },);
        console.log(`${chalk.cyan(`${getDateTime()} >>> Slash commands have been registered`)}`);

    } catch (error) {

        console.log(`${chalk.red(`${getDateTime()} >>> Slash commands have not been registered`)}`);
        console.error(error);

    }

    client.guilds.cache.forEach(async guild => {

        await DB.guilds.integrations.get(guild.id).then(data => {
            client.guildConfig[guild.id] = data.response;
        });
        await DB.voiceChannels.get(guild.id).then(data => {
            data.response.map(voiceChannel => client.voiceChannels.push(voiceChannel.channelId));
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