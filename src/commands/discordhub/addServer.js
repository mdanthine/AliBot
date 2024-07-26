const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = 'http://localhost:3000/api/discord_servers';

module.exports = {
    name: 'addserver',
    description: 'Adds a Discord server to the website.',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'id',
            description: 'Id of the discord server',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'invite',
            description: 'Invite link of the Discord server',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'categories',
            description: 'Categories of the server, separated by commas',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'tags',
            description: 'Tags of the server, separated by commas',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'keyfeatures',
            description: 'Key features of the server, separated by commas',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        const discordId = interaction.options.getString('id');
        const invite = interaction.options.getString('invite');
        const categories = interaction.options.getString('categories').split(',');
        const tags = interaction.options.getString('tags').split(',');
        const keyFeatures = interaction.options.getString('keyfeatures').split(',');

        const newServer = {
            id,
            invite,
            categories: categories.map(cat => cat.trim()),
            tags: tags.map(tag => tag.trim()),
            keyFeatures: keyFeatures.map(feature => feature.trim()),
        };

        try {
            const response = await axios.post(apiUrl, newServer);
            if (response.status === 200) {
                interaction.reply({ content: 'Server added to the JSON file successfully!' });
            } else {
                interaction.reply({ content: 'There was an error adding the server. Please try again later.', ephemeral: true });
            }
        } catch (error) {
            console.error('Error adding server:', error);
            interaction.reply({ content: 'There was an error adding the server. Please try again later.', ephemeral: true });
        }
    },
};