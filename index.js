import dotenv from "dotenv";
import { Client, Intents, Collection } from "discord.js";
import chalk from "chalk";
import DB from "./database/db.mjs";
import { getDateTime, verification } from "./modules/modules.mjs";
dotenv.config();
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

console.log("\n".repeat(10));
console.log(chalk.cyan.bold(`${getDateTime()} >>> Starting INFBOT Services...`));

/**
 * ! File verification
 */

await verification.commands(client);
verification.events();

/**
 * ! Login + Database connection
 */

(async () => {
	DB.connect();
	client.guildConfig = {};
	client.voiceChannels = [];
	client.login(process.env.DISCORD_AUTH_TOKEN).catch(error => {
		console.log(`${chalk.red.bold(`\n\n\n${getDateTime()} >>> Couldn't log into Discord. Please check your token in the .env file.`)}\n${error}`);
	});
})();

/**
 * ! Currently used event listeners
 */

client.on("ready", async () => {
	const { default: ready } = await import("./events/ready.mjs")
	ready(client);
});

client.on("interactionCreate", async interaction => {
	const { default: integrationCreate } = await import("./events/interactionCreate.mjs")
	integrationCreate(client, interaction);
});

// client.on("guildCreate", guild => require("./events/guildCreate")(guild, client, connection));
// client.on("guildDelete", guild => require("./events/guildDelete")(guild, client, connection));
// client.on("guildMemberAdd", member => require("./events/guildMemberAdd")(member, client));
// client.on("guildMemberRemove", member => require("./events/guildMemberRemove")(member, client));
// client.on("guildMemberUpdate", (oldMember, newMember) => require("./events/guildMemberUpdate")(oldMember, newMember, client));
// client.on("guildBanAdd", ban => require("./events/guildBanAdd")(ban, client));
// client.on("guildBanRemove", ban => require("./events/guildBanRemove")(ban, client));
// client.on("channelCreate", channel => require("./events/channelCreate")(channel, client));
// client.on("channelDelete", channel => require("./events/channelDelete")(channel, client));
// // client.on("channelUpdate", (oldChannel, newChannel) => require("./events/channelUpdate")(oldChannel, newChannel, client));
// client.on("emojiCreate", emoji => require("./events/emojiCreate")(emoji, client));
// client.on("emojiDelete", emoji => require("./events/emojiDelete")(emoji, client)); 
// client.on("emojiUpdate", (oldEmoji, newEmoji) => require("./events/emojiUpdate")(oldEmoji, newEmoji, client));
// client.on("stickerCreate", sticker => require("./events/stickerCreate")(sticker, client));
// client.on("stickerDelete", sticker => require("./events/stickerDelete")(sticker, client));
// client.on("stickerUpdate", (oldSticker, newSticker) => require("./events/stickerUpdate")(oldSticker, newSticker, client));
// client.on("roleCreate", role => require("./events/roleCreate")(role, client));
// client.on("roleDelete", role => require("./events/roleDelete")(role, client));
// client.on("roleUpdate", (oldRole, newRole) => require("./events/roleUpdate")(oldRole, newRole, client));

client.on("voiceStateUpdate", async (oldState, newState) => { // ! INFBOT Voice Channels
	const { default: voiceStateUpdate } = await import("./events/voiceStateUpdate.mjs")
	voiceStateUpdate(oldState, newState, client);
});