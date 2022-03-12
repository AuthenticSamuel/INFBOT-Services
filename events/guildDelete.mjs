import chalk from "chalk";

import DB from "../database/db.mjs";
import { getDateTime } from "../modules/modules.mjs";

/**
 * ! Handle removing old guilds from database
 */

export default async (guild, client) => {

    try {

		await DB.guilds.delete(guild.id);
		await DB.voiceChannels.delete(guild.id);
		delete client.guildConfig[guild.id];
        console.log(chalk.yellowBright(`${getDateTime()} >>> Left guild: ${guild.name} (ID: ${guild.id})`));

	} catch (error) {

        console.log(chalk.red(`${getDateTime()} >>> Error detected when leaving guild:`));
        console.log(error);

    }
}