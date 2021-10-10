module.exports = async (oldSticker, newSticker, client) => {

    let auditChannelId = client.guildConfig.get(newSticker.guild.id)[2];
    if (auditChannelId === "None") return;

    try {

        let auditChannel = newSticker.guild.channels.cache.get(auditChannelId);

        // Name change
        if (oldSticker.name !== newSticker.name) await auditChannel.send("`" + `Sticker updated: '${oldSticker.name}' -> '${newSticker.name}' (ID: ${newSticker.id})` + "`");
        // Description change
        if (oldSticker.description !== newSticker.description) await auditChannel.send("`" + `Sticker updated ${newSticker.name} (ID: ${newSticker.id}) description: '${oldSticker.description}' -> '${newSticker.description}'` + "`")

    } catch (error) {

        console.error(error);

    };
    
};