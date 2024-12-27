const { ApplicationCommandOptionType, PermissionFlagsBits, ChannelType, PermissionOverwrites, ButtonBuilder, ButtonStyle, ActionRowBuilder, ActionRow } = require('discord.js');
const createLog = require('../../utils/createLog');
const fetchApi = require('../../utils/fetchApi');

module.exports = {
    testOnly: true,
    name: "ticket",
    description: "Opens a ticket channel",
    options: [
        {
            name: 'type',
            description: 'Choose the type of ticket you want to create',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Support', value: 'support' },
                { name: 'Report', value: 'report' },
                { name: 'Discord server', value: 'discord-server' },
            ]
        }
    ],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction, logger) => {
        const { guild, user } = interaction;
        const ticketType = interaction.options.getString('type');

        const existingTicket = guild.channels.cache.find(channel => channel.name === `ticket-${ticketType}-${user.username}`);
        if (existingTicket) {
            interaction.reply({
                content: "You already have an open ticket.",
                ephemeral: true,
            });
            return;
        }

        try {
            const channel = await guild.channels.create({
                name: `ticket-${ticketType}-${user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            const deleteButton = new ButtonBuilder()
                .setCustomId('delete-ticket')
                .setLabel('Delete Ticket')
                .setStyle(ButtonStyle.Danger);

            const lockButton = new ButtonBuilder()
                .setCustomId('lock-ticket')
                .setLabel('Lock Ticket')
                .setStyle(ButtonStyle.Primary);

            let row = new ActionRowBuilder()
            switch (ticketType) {
                case 'support':
                    const supportButton = new ButtonBuilder()
                        .setCustomId('support-ticket')
                        .setLabel('Support')
                        .setStyle(ButtonStyle.Success)

                    row.addComponents(supportButton, deleteButton, lockButton);
                    break;

                case 'report':
                    const reportButton = new ButtonBuilder()
                        .setCustomId('report-ticket')
                        .setLabel('Report')
                        .setStyle(ButtonStyle.Success)

                    row.addComponents(reportButton, deleteButton, lockButton);
                    break;

                case 'discord-server':
                    const discordButton = new ButtonBuilder()
                        .setCustomId('discordserver-ticket')
                        .setLabel('Discord Server')
                        .setStyle(ButtonStyle.Success)

                    row.addComponents(discordButton, deleteButton, lockButton);
                    break;
            }

            await channel.send({
                content: `Hello ${user}, you have created a ${ticketType} ticket. Please click on the button for further instructions`,
                components: [row],
            });

            interaction.reply({
                content: `Ticket created: ${channel}`,
                ephemeral: true,
            });

            createLog(`Ticket Created`, `${capitalizeWord(ticketType)} Ticket`, interaction, 'create');

        } catch (error) {
            console.error(`Error creating ticket channel: ${error}`);
            interaction.reply({
                content: 'There was an error creating the ticket channel. Please try again later.',
                ephemeral: true,
            });
        }
    },
};

function capitalizeWord(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
