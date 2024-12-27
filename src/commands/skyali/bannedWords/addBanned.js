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

    callback: async (client, interaction) => {
        const word = interaction.options.getString('word');

        try {
            const response = await axios.post(apiUrl, { word });
            await interaction.reply('Word added successfully.');
        } catch (err) {
            await interaction.reply('An error occurred while adding the word.');
        }
    }
}