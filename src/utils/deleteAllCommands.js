module.exports = async () => { 
    try {
        const globalCommands = await client.application.commands.fetch();
        for (const command of globalCommands.values()) {
            await client.application.commands.delete(command.id);
            console.log(`Deleted global command: ${command.name}`);
        }

        const guildId = process.env.GUILD_ID;
        if (guildId) {
            const guild = client.guilds.cache.get(guildId);
            if (guild) {
                const guildCommands = await guild.commands.fetch();
                for (const command of guildCommands.values()) {
                    await guild.commands.delete(command.id);
                    console.log(`Deleted guild command: ${command.name}`);
                }
            }
        }

        console.log('All commands have been deleted.');
    } catch (error) {
        console.error('Error deleting commands:', error);
    } finally {
        client.destroy();
    }
}