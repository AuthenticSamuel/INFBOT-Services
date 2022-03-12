import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";

import { getDateTime } from "../modules/modules.mjs";
dotenv.config();

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

const DB = {
	connect() {
		mongoose.connect(
			process.env.MONGODB_URI,
			err => err ? console.error(err) : console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Successfully connected to database!`)),
		);
	},
	guilds: {
		async add(guildId) {
			try {

				const res = await Guilds.create({ guildId });
				console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Added guild "${res.guildId}".`));
				return {
					success: true,
				};

			} catch(error) {

				console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't add guild "${guildId}".`));
				return {
					success: false,
				};

			}
		},
		async delete(guildId) {
			try {

				const res = await Guilds.deleteOne({ guildId });
				console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Deleted guild "${res.guildId}".`));
				return {
					success: true,
				}

			} catch (error) {

				console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't delete guild "${guildId}".`));
				return {
					success: false,
				}

			}
		},
		integrations: {
			async get(guildId) {
				try {

					const guild = await Guilds.findOne({ guildId });
					if (!guild) throw Error;
					console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Found guild "${guild.guildId}".`));
					return {
						success: true,
						response: guild.integrations,
					}

				} catch (error) {

					console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find guild "${guildId}".`));
					return {
						success: false,
						response: null,
					}

				}
			},
			voice: {
				async get(guildId) {
					try {

						const guild = await Guilds.findOne({ guildId });
						if (!guild) throw Error;
						console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Found guild "${guild.guildId}" (integration: voice).`));
						return {
							success: true,
							response: {
								channel: guild.integrations.voice.channel,
								category: guild.integrations.voice.category,
							},
						}

					} catch (error) {

						console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find guild "${guildId}" (integration: voice).`));
						return {
							success: false,
							response: {
								channel: null,
								category: null,
							},
						}

					}
				},
				async set(guildId, channel = null, category = null) {
					try {

						const guild = await Guilds.findOne({ guildId });
						guild.integrations.voice.channel = channel;
						guild.integrations.voice.category = category;
						await guild.save();
						console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Updated guild "${guildId}" (integration: voice).`));
						return {
							success: true,
						}

					} catch(error) {

						console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't update guild "${guildId}" (integration: voice).`));
						return {
							success: false,
						}

					}
				},
			},
			channels: {
				welcome: {
					async get(guildId) {
						try {
	
							const guild = await Guilds.findOne({ guildId });
							if (!guild) throw Error;
							console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Found guild "${guild.guildId}" (integration: welcome channel).`));
							return {
								success: true,
								response: guild.integrations.channels.welcome,
							}
	
						} catch (error) {
	
							console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find guild "${guildId}" (integration: welcome channel).`));
							return {
								success: false,
								response: null,
							}
	
						}
					},
					async set(guildId, channel = null) {
						try {

							const guild = await Guilds.findOne({ guildId });
							guild.integrations.channels.welcome = channel;
							await guild.save();
							console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Updated guild "${guild.guildId}" (integration: welcome channel).`));
							return {
								success: true,
							}
	
						} catch(error) {
	
							console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't update guild "${guildId}" (integration: welcome channel).`));
							return {
								success: false,
							}
	
						}
					},
				},
				boost: {
					async get(guildId) {
						try {
	
							const guild = await Guilds.findOne({ guildId });
							if (!guild) throw Error;
							console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Found guild "${guild.guildId}" (integration: boost channel).`));
							return {
								success: true,
								response: guild.integrations.channels.boost,
							}
	
						} catch (error) {
	
							console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find guild "${guildId}" (integration: boost channel).`));
							return {
								success: false,
								response: null,
							}
	
						}
					},
					async set(guildId, channel = null) {
						try {

							const guild = await Guilds.findOne({ guildId });
							guild.integrations.channels.boost = channel;
							await guild.save();
							console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Updated guild "${guild.guildId}" (integration: boost channel).`));
							return {
								success: true,
							}
	
						} catch(error) {
	
							console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't update guild "${guildId}" (integration: boost channel).`));
							return {
								success: false,
							}
	
						}
					},
				},
				audit: {
					async get(guildId) {
						try {
	
							const guild = await Guilds.findOne({ guildId });
							if (!guild) throw Error;
							console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Found guild "${guild.guildId}" (integration: audit channel).`));
							return {
								success: true,
								response: guild.integrations.channels.audit,
							}
	
						} catch (error) {
	
							console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find guild "${guildId}" (integration: audit channel).`));
							return {
								success: false,
								response: null,
							}
	
						}
					},
					async set(guildId, channel = null) {
						try {

							const guild = await Guilds.findOne({ guildId });
							guild.integrations.channels.audit = channel;
							await guild.save();
							console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Updated guild "${guild.guildId}" (integration: audit channel).`));
							return {
								success: true,
							}
	
						} catch(error) {
	
							console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't update guild "${guildId}" (integration: audit channel).`));
							return {
								success: false,
							}
	
						}
					},
				},
			},
			roles: {
				newMember: {
					async get(guildId) {
						try {
	
							const guild = await Guilds.findOne({ guildId });
							if (!guild) throw Error;
							console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Found guild "${guild.guildId}" (integration: newMember role).`));
							return {
								success: true,
								response: guild.integrations.roles.newMember,
							}
	
						} catch (error) {
	
							console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find guild "${guildId}" (integration: newMember role).`));
							return {
								success: false,
								response: null,
							}
	
						}
					},
					async set(guildId, role = null) {
						try {

							const guild = await Guilds.findOne({ guildId });
							guild.integrations.roles.newMember = role;
							await guild.save();
							console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Updated guild "${guild.guildId}" (integration: newMember role).`));
							return {
								success: true,
							}
	
						} catch(error) {
	
							console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't update guild "${guildId}" (integration: newMember role).`));
							return {
								success: false,
							}
	
						}
					},
				},
			},
		},
	},
	voiceChannels: {
		async add(guildId, channelId) {
			try {

				const res = await VoiceChannels.create({ guildId, channelId });
				console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Added voice channel "${res.channelId}" in guild "${res.guildId}".`));
				return {
					success: true,
				};

			} catch(error) {

				console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't add voice channel in guild "${guildId}".`));
				return {
					success: false,
				};

			}
		},
		async delete(guildId, channelId = null) {
			try {

				if (channelId) {

					const res = await VoiceChannels.deleteOne({ channelId });
					console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Deleted voice channel "${channelId}" in guild "${guildId}".`));

				} else {

					const res = await VoiceChannels.deleteMany({ guildId });
					console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Deleted all voice channels in guild "${guildId}".`));

				}

				return {
					success: true,
				}

			} catch (error) {

				console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't delete voice channel(s) in guild "${guildId}".`));
				return {
					success: false,
				}

			}
		},
		async get(guildId) {
			try {

				const voiceChannels = await VoiceChannels.find({ guildId });
				console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Found voice channels in guild "${guildId}".`));
				return {
					success: true,
					response: voiceChannels,
				}

			} catch (error) {

				console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find any voice channels in guild "${guildId}".`));
				return {
					success: false,
					response: null,
				}

			}
		},
		settings: {
			invitedUsers: {
				async get(guildId, channelId) {
					try {
	
						const voiceChannel = await VoiceChannels.findOne({ channelId });
						if (!voiceChannel) throw Error;
						console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Found voice channel "${voiceChannel.channelId}" in guild "${voiceChannel.guildId}" (setting: invitedUsers).`));
						return {
							success: true,
							response: voiceChannel.invitedUsers,
						}

					} catch (error) {

						console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't find voice channel "${channelId}" in guild "${guildId}" (setting: invitedUsers).`));
						return {
							success: false,
							response: null,
						}

					}
				},
				async set(guildId, channelId, users = []) {
					try {

						const voiceChannel = await VoiceChannels.findOne({ channelId });
						voiceChannel.invitedUsers = users;
						await voiceChannel.save();
						console.log(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Updated voice channel "${voiceChannel.channelId}" in guild "${voiceChannel.guildId}".`));
						return {
							success: true,
						}
		
					} catch(error) {
		
						console.warn(chalk.cyan.bold(`${getDateTime()} >>> MongoDB: Couldn't update voice channel "${channelId}" in guild "${guildId}".`));
						return {
							success: false,
						}
		
					}
				},
			},
		},
	},
};

export default DB;