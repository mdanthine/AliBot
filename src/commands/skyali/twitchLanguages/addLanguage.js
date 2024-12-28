const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = 'http://backend:5000/api/twitch-languages'

module.exports = {
    name: 'addlanguage',
    description: 'Add a twitch language',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'code',
            description: 'Code of the language (en)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'name',
            description: 'Name of the language (English)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction, logger) => {
        const code = interaction.options.getString('code');
        const name = interaction.options.getString('name');

        try {
            const response = await axios.post(apiUrl, { code, name });

            logger.info(interaction, 'Language added successfully.', 
                { Code: code, Name: name });
            await interaction.reply('Language added successfully.');
        } catch (error) {
            logger.error(interaction, 'Error adding language', 
                { Error: error.message, Code: code, Name: name });
            await interaction.reply('An error occurred while adding the language.');
        }
    }
}