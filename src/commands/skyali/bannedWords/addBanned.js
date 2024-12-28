const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = "http://backend:5000/api/youtube/banned-words";

module.exports = {
    name: 'addbanned',
    description: 'Add a youtube banned word',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'word',
            description: 'Word to be banned',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction, logger) => {
        const word = interaction.options.getString('word');

        try {
            const response = await axios.post(apiUrl, { word });

            logger.info(interaction, 'Word added successfully.', 
                { Word: word });
            await interaction.reply('Word added successfully.');
        } catch (error) {
            logger.error(interaction, 'Error adding word', 
                { Error: error.message, Word: word });
            await interaction.reply('An error occurred while adding the word.');
        }
    }
}