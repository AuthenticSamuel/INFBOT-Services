/**
 * ! Handle removing old guilds from database
 */

module.exports = async (guild, connection) => {
    try {
		await connection.query(`DELETE FROM guilds WHERE guildId = '${guild.id}'`);
		await connection.query(`DELETE FROM utils WHERE guildId = '${guild.id}'`);
		await connection.query(`DELETE FROM voice WHERE guildId = '${guild.id}'`);
		await connection.query(`DELETE FROM voiceChannels WHERE guildId = '${guild.id}'`);
		client.guildConfig.remove(guild.id);
        console.log(colors.brightYellow(`${getDateTime()} >>> Left guild: ${guild.name} (ID: ${guild.id})`));
	} catch (error) {
        console.log(colors.red(`${getDateTime()} >>> Error detected when leaving guild:`));
        console.log(error);
    }
}