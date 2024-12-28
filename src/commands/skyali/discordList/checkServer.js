const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = "http://backend:5000/api/discord/servers";

module.exports = {
    name: 'checkserver',
    description: 'Check for a discord server',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'id',
            description: 'Server id',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction, logger) => {
        const serverId = interaction.options.getString('id');

        try {
            const response = await axios.get(apiUrl);
            const servers = response.data;
            const server = servers.find(s => s.id === serverId || s.name === serverId);

            if (server) {
                logger.info(interaction, 'Server found.', 
                    { ID: serverId });
                await interaction.reply(`Server found:\n\`\`\`${JSON.stringify(server, null, 2)}\`\`\``);
            } else {
                logger.warn(interaction, 'Server not found.', 
                    { ID: serverId });
                await interaction.reply('Server not found.');
            }
        } catch (error) {
            logger.error(interaction, 'Error fetching server list', 
                { Error: error.message, ID: serverId });
            await interaction.reply('An error occurred while fetching the server list.');
        }
    }
}