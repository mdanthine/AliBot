const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = "http://backend:5000/api/discord/servers";

module.exports = {
    name: 'updateserver',
    description: 'Update a discord server',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'id',
            description: 'Discord server id',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'link',
            description: 'New server link',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'categories',
            description: 'Categories of the server, separated by commas',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'tags',
            description: 'Tags of the server, separated by commas',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'keyfeatures',
            description: 'Key features of the server, separated by commas',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const discordId = interaction.options.getString('id');
        const link = interaction.options.getString('link');
        const categories = interaction.options.getString('categories')?.split(',').map(cat => cat.trim());
        const tags = interaction.options.getString('tags')?.split(',').map(tag => tag.trim());
        const keyFeatures = interaction.options.getString('keyfeatures')?.split(',').map(feature => feature.trim());

        try {
            const serverResponse = await axios.get(`${apiUrl}?id=${discordId}`);
            const serverData = serverResponse.data;

            if (!serverData || serverData.length === 0) {
                interaction.editReply('Server not found.');
                return;
            }

            const serverId = serverData[0]._id;
            const updateData = { link };
            if (categories) updateData.categories = categories;
            if (tags) updateData.tags = tags;
            if (keyFeatures) updateData.keyFeatures = keyFeatures;

            const response = await axios.put(`${apiUrl}/${serverId}`, updateData);
            interaction.editReply('Server updated successfully.');
        } catch (err) {
            interaction.editReply('An error occurred while updating the server.');
        }
    }
};