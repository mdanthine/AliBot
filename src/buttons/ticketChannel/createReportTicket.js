const { ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: 'create-report-ticket',
    callback: async (client, interaction) => {
        const { guild, user } = interaction;
        const existingTicket = guild.channels.cache.find(channel => channel.name === `ticket-report-${user.username}`);
        if (existingTicket) {
            return interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
        }

        try {
            const channel = await guild.channels.create({
                name: `ticket-report-${user.username}`,
                type: ChannelType.GuildText,
                PermissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    }
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
            
            const reportButton = new ButtonBuilder()
                .setCustomId('report-ticket')
                .setLabel('Report Form')
                .setStyle(ButtonStyle.Success)
            
            const row = new ActionRowBuilder().addComponents(reportButton, lockButton, deleteButton);
            
            await channel.send({
                content: `Hello ${user}. Thank you for creating a ticket. Please click on the button for further instructions.`,
                components: [row],
            });

            
        } catch (error) {
            console.error(`Error creating report ticket channel: ${error}`);
            interaction.reply({ content: 'There was an error creating the ticket', ephemeral: true});
        }
    }
}
