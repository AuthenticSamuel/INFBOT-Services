const colors = require("colors");
const getDateTime = require("./getDateTime");
const fs = require("fs");
const { Collection } = require("discord.js");

/**
 * ! Handle file verification
 */

module.exports = {
    commands: (client) => {
        const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
        const commands = [];
        client.commands = new Collection();
        console.log(colors.brightBlue(`${getDateTime()} >>> Slash commands:`));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
            console.log(`${colors.brightBlue(`${getDateTime()} >>>   `)}${file}`);
        }
        client.commandsArray = commands;
    },
    events: () => {
        console.log(colors.brightBlue(`${getDateTime()} >>> Events:`));
        const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            console.log(`${colors.brightBlue(`${getDateTime()} >>>   `)}${file}`);
        };
    },
    functions: () => {
        console.log(colors.brightBlue(`${getDateTime()} >>> Functions:`));
        const functionFiles = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
        for (const file of functionFiles) {
            console.log(`${colors.brightBlue(`${getDateTime()} >>>   `)}${file}`);
        };
    },
}