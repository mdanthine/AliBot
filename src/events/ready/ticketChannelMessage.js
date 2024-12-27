const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const { ticketChannel } = require('../../../config.json');

module.exports = async (client) => {
    console.log(`${client.user.tag} is online`);

    try {
        const channel = await client.channels.fetch(ticketChannel);
        if (!channel) {
            console.error('Ticket channel not found.');
            return;
        }

        const messages = await channel.messages.fetch();
        channel.bulkDelete(messages);

        const supportButton = new ButtonBuilder()
            .setCustomId('create-support-ticket')
            .setLabel('Support')
            .setStyle(ButtonStyle.Success);

        const reportButton = new ButtonBuilder()
            .setCustomId('create-report-ticket')
            .setLabel('Report')
            .setStyle(ButtonStyle.Danger);
        
        const discordButton = new ButtonBuilder()
            .setCustomId('create-discord-ticket')
            .setLabel('Discord Server')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(supportButton, reportButton, discordButton);
        
        await channel.send({
            content: 'Please select the type of ticket you would like to create:\n\n' +
                 '**Support**: For general support inquiries concerning the discord server\n' +
                 '**Report**: To report a technial issue regarding one ouf our services.\n' +
                 '**Discord Server**: If you want your discord server to be added to the list.\n\n' +
                 'Once you open a ticket, click on the button corresponding to your demand and fill out the informations, then wait for a response from our staff.',
            components: [row],
        });

        console.log('Ticket message sent.');
    } catch (error) {
        console.error('Failed to send ticket message: ', error);
    }
}