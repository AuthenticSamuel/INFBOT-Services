import { MessageEmbed, Collection } from "discord.js";
import fs from "fs";
import { readFile } from "fs/promises";
import chalk from "chalk";

export const config = JSON.parse(await readFile("./config.json"));

export const packageJSON = JSON.parse(await readFile("./package.json"));

export const capitalizeFirstLetter = string => string[0].toUpperCase() + string.slice(1);

export const createEmbedError = (title = "Error", desc = "We've encountered an error.") => {
	const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(desc)
        .setColor(config.COLOR.ERROR)
    return embed;
}

export const emoji = {
	a: '🇦', b: '🇧', c: '🇨', d: '🇩', e: '🇪', f: '🇫', g: '🇬', h: '🇭', i: '🇮', j: '🇯', k: '🇰', l: '🇱', m: '🇲',
    n: '🇳', o: '🇴', p: '🇵', q: '🇶', r: '🇷', s: '🇸', t: '🇹', u: '🇺',v: '🇻', w: '🇼', x: '🇽', y: '🇾', z: '🇿',
    0: '0️⃣', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣', 10: '🔟',
    '#': '#️⃣', '*': '*️⃣', '!': '❗', '?': '❓',
}

export const formatFullDate = date => {
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
	}
	return date.toLocaleDateString(undefined, options);
}

export const getAuditDate = () => {
	const getDate = new Date();
    return `${getDate.toLocaleString("fr-FR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC", timeZoneName: "short", })}`;
}

export const getDateTime = () => {
	const getDate = new Date();
	return `${getDate.toLocaleString()}`;
}

export const leadingZeroes = value => value.toString().length < 2 ? `0${value}` : `${value}`;

export const logEvent = (command, result = "") => {
	if (result.startsWith("SUCCESS")) result = `[${chalk.green(result)}]`;
	else if (result.startsWith("ERROR")) result = `[${chalk.red(result)}]`;
	else if (result.startsWith("WARN")) result = `[${chalk.yellow(result)}]`;
	return console.log(chalk.white(`${getDateTime()} >>> A user executed the ${chalk.magenta(command)} command. ${result}`));
}

export const logVoice = state => {
	const getState = inputState => {
        switch (inputState) {
            case "creating": return "A user is creating a new voice channel...";
            case "created": return "Voice channel created successfully.";
            case "deleting": return "Deleting an empty voice channel...";
            case "deleted": return "Voice channel deleted successfully.";
            default: return "Unknown channel action.";
        }
    }
    return console.log(chalk.yellow(`${getDateTime()} >>> ${getState(state)}`));
}

export const verification = {
	commands: async client => {
        const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".mjs"));
        const commands = [];
        client.commands = new Collection();
        console.log(chalk.cyan(`${getDateTime()} >>> Slash commands:`));
        for (const file of commandFiles) {
			const { default: command } = await import(`../commands/${file}`);
			commands.push(command.data.toJSON());
			client.commands.set(command.data.name, command);
			console.log(`${chalk.cyan(`${getDateTime()} >>>   `)}${file}`);
        }
        client.commandsArray = commands;
    },
    events: () => {
        console.log(chalk.cyan(`${getDateTime()} >>> Events:`));
        const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".mjs"));
        for (const file of eventFiles) {
            console.log(`${chalk.cyan(`${getDateTime()} >>>   `)}${file}`);
        };
    },
}