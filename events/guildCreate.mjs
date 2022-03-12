import chalk from "chalk";

import DB from "../database/db.mjs";
import { getDateTime } from "../modules/modules.mjs";

/**
 * ! Handle adding new guild to database
 */

export default async (guild, client) => {

    try {

		await DB.guilds.add(guild.id);
		await DB.guilds.integrations.get(guild.id).then(data => client.guildConfig[guild.id] = data.response);
        console.log(chalk.yellowBright(`${getDateTime()} >>> Joined guild: ${guild.name} (ID: ${guild.id})`));

	} catch (error) {

        console.log(chalk.red(`${getDateTime()} >>> Error detected when joining guild:`));
        console.log(error);

    }
}