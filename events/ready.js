const colors = require("colors");
const config = require("../config.json");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const getDateTime = require("../functions/getDateTime");
const packageJSON = require("../package.json");

module.exports = async (client) => {

    commands = client.commandsArray;
    let connection = client.connection;

    let totalMembers = 0;
    let allGuildInfo = [];
    client.guilds.cache.forEach((guild) => {

        if (guild.memberCount != NaN) totalMembers += guild.memberCount;
        allGuildInfo.push(new Server(guild.id, guild.name, guild.memberCount));
        guild.members.fetch();

        /*connection.query(
            `
            INSERT INTO guilds (guildId) VALUES ('${guild.id}')
            `
        );*/

    });

    function Server(id, name, members) {
        this.Guild_ID = id;
        this.Guild_Name = name;
        this.Members = members;
    };

    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_AUTH_TOKEN);

    try {

        if (!config.guildId) await rest.put(Routes.applicationGuildCommands(client.user.id), { body: commands },);
        else await rest.put(Routes.applicationGuildCommands(client.user.id, config.guildId), { body: commands },);
        console.log(`${colors.brightBlue(`${getDateTime()} >>> Slash commands have been registered`)}`);

    } catch (error) {
        
        console.log(`${colors.red(`${getDateTime()} >>> Slash commands have not been registered`)}`);
        console.error(error);
    
    };

    try {

        client.guilds.cache.forEach(async (guild) => {

            await connection.query(
                `
                SELECT *
                FROM guilds
                WHERE guildId = '${guild.id}'
                `
            ).then(result => {
    
                let resultObject = result[0][0];
                let configOptions = [];
                for (const [key, value] of Object.entries(resultObject)) {
                    if (key !== "guildId") configOptions.push(value)
                };
                client.guildConfig.set(guild.id, configOptions)
                
            });
    
        });

        console.log(`${colors.brightBlue(`${getDateTime()} >>> Database fetch successful`)}`);

    } catch (error) {

        console.log(`${colors.red(`${getDateTime()} >>> Database fetch unsuccessful`)}`);
        console.log(error);

    };
    
    console.log(`${colors.cyan(`${getDateTime()} >>> INFBOT Utilities ${colors.white(packageJSON["version"])} Online • ${colors.white(client.guilds.cache.size)} guilds • ${colors.white(totalMembers)} members`)}`);
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

};