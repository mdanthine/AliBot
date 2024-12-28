const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = "http://backend:5000/api/twitch-languages";

module.exports = {
    name: 'getlanguages',
    description: 'Get all twitch languages',
    devOnly: true,
    testOnly: true,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction, logger) => {
        try {
            const response = await axios.get(apiUrl);
            const languages = response.data.map(language => `\`${language.code}\` - ${language.name}`).join('\n');

            logger.info(interaction, 'Languages retrieved successfully.', 
                { Amount: response.data.length });
            await interaction.reply(`**Languages (${response.data.length}):**\n${languages}`);
        } catch (error) {
            logger.error(interaction, 'Error getting languages', 
                { Error: error.message });
            await interaction.reply('An error occurred while getting the languages.');
        }
    }
}