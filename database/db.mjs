import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";

import { getDateTime } from "../modules/modules.mjs";

dotenv.config();

export const connection = mongoose.connect(
	process.env.MONGODB_URI,
	err => err ? console.error(err) : console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Successfully connected to database!`)),
);

const guildSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: true,
		unique: true,
	},
	integrations: {
		voice: {
			channel: {
				type: String,
				default: null,
			},
			category: {
				type: String,
				default: null,
			},
		},
		channels: {
			welcome: {
				type: String,
				default: null,
			},
			boost: {
				type: String,
				default: null,
			},
			audit: {
				type: String,
				default: null,
			},
		},
		roles: {
			newMember: {
				type: String,
				default: null,
			},
		},
	},
});

const voiceChannelSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: true,
	},
	channelId: {
		type: String,
		required: true,
	},
	invitedUsers: {
		type: [String],
		default: null,
	}
});

const Guilds = mongoose.model("guilds", guildSchema);
const VoiceChannels = mongoose.model("voicechannels", voiceChannelSchema);

const newGuild = guildId => {
	const guild = new Guilds({ guildId });
	guild.save(err => {
		if (err) {
			if (err.name === "MongoServerError" && err.code === 11000) console.error(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Guild "${guildId}" already exists.`));
			else console.error(err);
		} else console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Added guild "${guildId}".`));
	});
}

const delGuild = guildId => {
	Guilds.deleteOne(
		{ guildId },
		err => err ? console.error(err) : console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Removed guild "${guildId}".`)),
	);
}

const updateGuild = async (guildId, guildData) => {
	const guild = await Guilds.findOne({ guildId });
	if (!guild) return console.error(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find guild "${guildId}".`));
	for (const [key, value] of Object.entries(guildData)) guild[key] = value;
	guild.save(err => {
		if (err) console.error(err);		
		else console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Updated guild "${guildId}".`));
	});
}

const fetchGuildInfo = async guildId => {
	const guild = await Guilds.findOne({ guildId });
	if (!guild) return console.error(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find guild "${guildId}".`));
	return guild;
}


const newVoiceChannel = (guildId, channelId) => {
	const voiceChannel = new VoiceChannels({ guildId, channelId });
	voiceChannel.save(err => {
		if (err) console.error(err);
		else console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Added voice channel "${channelId}" in guild "${guildId}".`));
	});
}

const delVoiceChannel = (guildId, channelId = undefined) => {
	if (channelId) {
		VoiceChannels.deleteOne(
			{ channelId },
			err => err ? console.error(err) : console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Removed voice channel "${channelId}" from guild "${guildId}".`)),
		);
	} else {
		VoiceChannels.deleteMany(
			{ guildId },
			err => err ? console.error(err) : console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Removed all voice channels from guild "${guildId}".`)),
		);
	}
}

const updateVoiceChannel = async (guildId, channelId, channelData) => {
	const voiceChannel = await VoiceChannels.findOne({ channelId });
	for (const [key, value] of Object.entries(channelData)) voiceChannel[key] = value;
	voiceChannel.save(err => {
		if (err) console.error(err);		
		else console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Updated voice channel "${channelId}" in guild "${guildId}".`));
	});
}

const fetchVoiceChannelInfo = async (guildId, channelId = null) => {
	if (channelId) {
		const voiceChannel = await VoiceChannels.findOne({ channelId });
		return voiceChannel;
	} else {
		const voiceChannels = await VoiceChannels.find({ guildId });
		return voiceChannels;
	}
}

export {
	newGuild,
	delGuild,
	updateGuild,
	fetchGuildInfo,
	newVoiceChannel,
	delVoiceChannel,
	updateVoiceChannel,
	fetchVoiceChannelInfo,
};