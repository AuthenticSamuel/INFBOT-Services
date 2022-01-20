require("dotenv").config();
const { Client, Intents, Collection } = require("discord.js");
const getDateTime = require("./functions/getDateTime");
const verification = require("./functions/verification");
const colors = require("colors");
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
let connection;

console.log("\n".repeat(10));
console.log(colors.cyan(`${getDateTime()} >>> Starting INFBOT Services...`));

/**
 * ! File verification
 */

verification.commands(client);
verification.events();
verification.functions();

/**
 * ! Login + Database connection
 */

(async () => {
	connection = await require("./database/db");
	client.connection = connection;
	client.guildConfig = new Collection();
	client.voiceConfig = new Collection();
	client.voiceChannels = [];
	client.login(process.env.DISCORD_AUTH_TOKEN).catch(error => {
		console.log(`${colors.red(`\n\n\n${getDateTime()} >>> Couldn't log into Discord. Please check your token in the .env file.`)}\n${error}`);
	});
})();

/**
 * ! Currently used event listeners
 */

client.on("ready", () => require("./events/ready")(client));
client.on("interactionCreate", interaction => require("./events/interactionCreate")(client, interaction));
client.on("guildCreate", guild => require("./events/guildCreate")(guild, client, connection));
client.on("guildDelete", guild => require("./events/guildDelete")(guild, client, connection));
client.on("guildMemberAdd", member => require("./events/guildMemberAdd")(member, client));
client.on("guildMemberRemove", member => require("./events/guildMemberRemove")(member, client));
client.on("guildMemberUpdate", (oldMember, newMember) => require("./events/guildMemberUpdate")(oldMember, newMember, client));
client.on("guildBanAdd", ban => require("./events/guildBanAdd")(ban, client));
client.on("guildBanRemove", ban => require("./events/guildBanRemove")(ban, client));
client.on("channelCreate", channel => require("./events/channelCreate")(channel, client));
client.on("channelDelete", channel => require("./events/channelDelete")(channel, client));
// client.on("channelUpdate", (oldChannel, newChannel) => require("./events/channelUpdate")(oldChannel, newChannel, client));
client.on("emojiCreate", emoji => require("./events/emojiCreate")(emoji, client));
client.on("emojiDelete", emoji => require("./events/emojiDelete")(emoji, client)); 
client.on("emojiUpdate", (oldEmoji, newEmoji) => require("./events/emojiUpdate")(oldEmoji, newEmoji, client));
client.on("stickerCreate", sticker => require("./events/stickerCreate")(sticker, client));
client.on("stickerDelete", sticker => require("./events/stickerDelete")(sticker, client));
client.on("stickerUpdate", (oldSticker, newSticker) => require("./events/stickerUpdate")(oldSticker, newSticker, client));
client.on("roleCreate", role => require("./events/roleCreate")(role, client));
client.on("roleDelete", role => require("./events/roleDelete")(role, client));
client.on("roleUpdate", (oldRole, newRole) => require("./events/roleUpdate")(oldRole, newRole, client));
client.on("voiceStateUpdate", (oldState, newState) => require("./events/voiceStateUpdate")(oldState, newState, client));	// ! INFBOT Voice Channels