const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const apiUrl = 'http://backend:5000/api/discord/servers';

module.exports = {
    name: 'getservers',
    description: 'Get all discord servers',
    devOnly: true,
    testOnly: true,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        try {
            const response = await axios.get(apiUrl);
            const servers = response.data.map(server => `${server.id} -> ${server.discord.id} ${server.discord.name} ${server.id === server.discord.id}`);
            await interaction.reply(`Servers: \n${servers.join('\n')}`);
        } catch (err) {
            await interaction.reply('An error occurred while getting the servers.');
        }
    }
}