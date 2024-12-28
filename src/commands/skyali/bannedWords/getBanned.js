const { PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = 'http://backend:5000/api/youtube/banned-words';

module.exports = {
    name: 'getbanned',
    description: 'Get all youtube banned words',
    devOnly: true,
    testOnly: true,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    
    callback: async (client, interaction, logger) => {
        try {
            const response = await axios.get(apiUrl);
            const words = response.data.map(word => word.word);

            logger.info(interaction, 'Banned words retrieved successfully.',
                { Amount: response.data.length });
            await interaction.reply(`Banned words (${words.length}):\n\`\`\`${words.join('\t')}\`\`\``);
            
        } catch (error) {
            logger.error(interaction, 'Error getting banned words', 
                { Error: error.message });
            await interaction.reply('An error occurred while getting the banned words.');
        }
    }
}
