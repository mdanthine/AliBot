const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = "http://backend:5000/api/twitch-languages";

module.exports = {
    name: 'removelanguage',
    description: 'Remove a twitch language',
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
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        const code = interaction.options.getString('code');
        const name = interaction.options.getString('name');

        try {
            const response = await axios.delete(`${apiUrl}/${code}`);
            await interaction.reply('Language removed successfully.');
        } catch (err) {
            await interaction.reply('An error occurred while removing the language.');
        }
    }
}