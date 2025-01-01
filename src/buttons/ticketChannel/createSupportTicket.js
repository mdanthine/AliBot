const { ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const createLog = require('../../utils/createLog');

module.exports = {
    id: 'create-support-ticket',

    callback: async (client, interaction) => {
        const { guild, user } = interaction;

        try {
            const existingTicket = guild.channels.cache.find(channel => channel.name === `ticket-support-${user.username}`);
            if (existingTicket) return interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
            
            const channel = await guild.channels.create({
                name: `ticket-support-${user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [{
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    }, {
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
            
            const supportButton = new ButtonBuilder()
                .setCustomId('support-ticket')
                .setLabel('Support Form')
                .setStyle(ButtonStyle.Success)
            
            const row = new ActionRowBuilder().addComponents(supportButton, lockButton, deleteButton);
            
            await channel.send({
                content: `Hello ${user}. Thank you for creating a ticket. Please click on the button for further instructions.`,
                components: [row],
            });

            createLog(client, 'Support Ticket', '', interaction, 'success');
            await interaction.reply({ 
                content: `Ticket successfully created at <#${channel.id}>`, 
                ephemeral: true 
            });

        } catch (error) {
            console.error(`Error creating support ticket channel: ${error}`);
            createLog(client, 'Error', `**Error**: ${error.message}`, interaction, 'error');
            await interaction.reply({ 
                content: 'There was an error creating the ticket', 
                ephemeral: true
            });
        }
    }
}