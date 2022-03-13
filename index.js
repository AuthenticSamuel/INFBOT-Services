import dotenv from "dotenv";
import { Client, Intents } from "discord.js";
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
console.log(chalk.cyan(`${getDateTime()} >>> Starting INFBOT Services...`));

/**
 * ! Files
 */

await verification.commands(client);
verification.events();

/**
 * ! Login + Database connection
 */

(async () => {
	DB.disconnect();
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
	const { default: execute } = await import("./events/ready.mjs");
	execute(client);
});

client.on("interactionCreate", async interaction => {
	const { default: execute } = await import("./events/interactionCreate.mjs");
	execute(client, interaction);
});

client.on("guildCreate", async guild => {
	const { default: execute } = await import("./events/guildCreate.mjs");
	execute(guild, client);
});

client.on("guildDelete", async guild => {
	const { default: execute } = await import("./events/guildDelete.mjs");
	execute(guild, client);
});

client.on("guildMemberAdd", async member => {
	const { default: execute } = await import("./events/guildMemberAdd.mjs");
	execute(member, client);
});

client.on("guildMemberRemove", async member => {
	const { default: execute } = await import("./events/guildMemberRemove.mjs");
	execute(member, client);
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
	const { default: execute } = await import("./events/guildMemberUpdate.mjs");
	execute(oldMember, newMember, client);
});

client.on("guildBanAdd", async ban => {
	const { default: execute } = await import("./events/guildBanAdd.mjs");
	execute(ban, client);
});

client.on("guildBanRemove", async ban => {
	const { default: execute } = await import("./events/guildBanRemove.mjs");
	execute(ban, client);
});

client.on("channelCreate", async channel => {
	const { default: execute } = await import("./events/channelCreate.mjs");
	execute(channel, client);
});

client.on("channelDelete", async channel => {
	const { default: execute } = await import("./events/channelDelete.mjs");
	execute(channel, client);
});

// TODO: Causing bugs ATM
// client.on("channelUpdate", async channel => {
// 	const { default: execute } = await import("./events/channelUpdate.mjs");
// 	execute(channel, client);
// });

client.on("emojiCreate", async emoji => {
	const { default: execute } = await import("./events/emojiCreate.mjs");
	execute(emoji, client);
});

client.on("emojiDelete", async emoji => {
	const { default: execute } = await import("./events/emojiDelete.mjs");
	execute(emoji, client);
});

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
	const { default: execute } = await import("./events/emojiUpdate.mjs");
	execute(oldEmoji, newEmoji, client);
});

client.on("stickerCreate", async sticker => {
	const { default: execute } = await import("./events/stickerCreate.mjs");
	execute(sticker, client);
});

client.on("stickerDelete", async sticker => {
	const { default: execute } = await import("./events/stickerDelete.mjs");
	execute(sticker, client);
});

client.on("stickerUpdate", async (oldSticker, newSticker) => {
	const { default: execute } = await import("./events/stickerUpdate.mjs");
	execute(oldSticker, newSticker, client);
});

client.on("roleCreate", async role => {
	const { default: execute } = await import("./events/roleCreate.mjs");
	execute(role, client);
});

client.on("roleDelete", async role => {
	const { default: execute } = await import("./events/roleDelete.mjs");
	execute(role, client);
});

client.on("roleUpdate", async (oldRole, newRole) => {
	const { default: execute } = await import("./events/roleUpdate.mjs");
	execute(oldRole, newRole, client);
});

client.on("voiceStateUpdate", async (oldState, newState) => { // ! INFBOT Voice Channels
	const { default: execute } = await import("./events/voiceStateUpdate.mjs");
	execute(oldState, newState, client);
});