/**
 * ! Handle adding new guild to database
 */

module.exports = async (guild, client, connection) => {
    try {
		await connection.query(`INSERT INTO guilds (guildId) VALUES('${guild.id}')`);
		await connection.query(`INSERT INTO utils (guildId) VALUES('${guild.id}')`);
		await connection.query(`INSERT INTO voice (guildId) VALUES('${guild.id}')`);
		client.guildConfig.set(guild.id, ["None", "None", "None"]);
        console.log(colors.brightYellow(`${getDateTime()} >>> Joined guild: ${guild.name} (ID: ${guild.id})`));
	} catch (error) {
        console.log(colors.red(`${getDateTime()} >>> Error detected when joining guild:`));
        console.log(error);
    }
}