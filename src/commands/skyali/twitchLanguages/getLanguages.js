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
            const languages = response.data.map(language => `${language.code} - ${language.name}`);
            logger.info(interaction, 'Languages retrieved successfully.');
            await interaction.reply(`Languages: ${languages.join(', ')}`);
        } catch (err) {
            console.log(err)
            await interaction.reply('An error occurred while getting the languages.');
        }
    }
}