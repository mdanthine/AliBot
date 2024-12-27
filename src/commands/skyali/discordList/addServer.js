const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

async function getDiscordData(inviteUrl) {
    const inviteCode = inviteUrl.split('/').pop();
    const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`);
    const data = await response.json();
    return {
        expiration_date: data.expires_at,
        id: data.guild.id,
        name: data.guild.name,
        splash: data.guild.splash,
        banner: data.guild.banner,
        description: data.guild.description,
        icon: data.guild.icon,
        features: data.guild.features,
        nsfw_level: data.guild.nsfw_level,
        nsfw: data.guild.nsfw,
        vanity_url_code: data.guild.vanity_url_code,
        premium_subscription_count: data.guild.premium_subscription_count,
        total: data.approximate_member_count,
        online: data.approximate_presence_count
    };
}

const apiUrl = 'http://backend:5000/api/discord/servers';

module.exports = {
    name: 'addserver',
    description: 'Adds a Discord server to the website.',
    devOnly: true,
    testOnly: true,
    options: [
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
        await interaction.deferReply();


        const invite = interaction.options.getString('invite');
        const categories = interaction.options.getString('categories').split(',').map(cat => cat.trim());
        const tags = interaction.options.getString('tags').split(',').map(tag => tag.trim());
        const keyFeatures = interaction.options.getString('keyfeatures').split(',').map(feature => feature.trim());

        try {
            await interaction.deferReply();
            const discordData = await getDiscordData(invite);

            const newServer = {
                id: discordData.id,
                invite,
                categories,
                tags,
                keyFeatures,
                discord: discordData,
            };

            const response = await axios.post(apiUrl, newServer);
            interaction.editReply('Server added to the database successfully!');
        } catch (error) {
            console.error('Error adding server:', error);
            interaction.editReply({ content: 'There was an error adding the server. Please try again later.', ephemeral: true });
        }
    },
};
