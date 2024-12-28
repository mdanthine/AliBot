const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = 'http://backend:5000/api/discord/servers';

module.exports = {
    name: 'removeserver',
    description: 'Remove a discord server',
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
        const id = interaction.options.getString('id');

        try {
            const response = await axios.delete(`${apiUrl}/${id}`);

            logger.info(interaction, 'Server removed successfully.', 
                { ID: id });
            await interaction.reply('Server removed successfully.');
        } catch (error) {
            logger.error(interaction, 'Error removing server', 
                { Error: error.message, ID: id });
            await interaction.reply('An error occurred while removing the server.');
        }
    }
}