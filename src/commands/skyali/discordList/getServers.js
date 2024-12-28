const { PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = 'http://backend:5000/api/discord/servers';

module.exports = {
    name: 'getservers',
    description: 'Get all discord servers',
    devOnly: true,
    testOnly: true,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction, logger) => {
        try {
            const response = await axios.get(apiUrl);
            const servers = response.data.map(server => `${server.discord.name}: \`\`\`Link ID {${server.id}} -> Server ID {${server.discord.id}} | Match: ${server.id === server.discord.id}\`\`\``);

            logger.info(interaction, 'Servers retrieved successfully.', 
                { Amount: response.data.length });    
            await interaction.reply(`**Servers (${response.data.length}):** \n${servers.join('')}`);
            
        } catch (error) {
            logger.error(interaction, 'Error getting servers', 
                { Error: error.message });
            await interaction.reply('An error occurred while getting the servers.');
        }
    }
}