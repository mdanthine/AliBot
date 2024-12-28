const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const createLog = require('../../utils/createLog');


module.exports = {
    id: 'lock-ticket',

    callback: async (client, interaction) => {
        const { channel, user, guild } = interaction;

        try {
            const channelPermissions = await channel.permissionOverwrites.cache;
            const isLocked = channelPermissions.some(permission =>
                (permission.id === guild.id && !permission.allow.has(PermissionFlagsBits.SendMessages)));

            const lockButton = new ButtonBuilder()
                .setCustomId('lock-ticket')
                .setLabel(isLocked ? 'Lock Ticket' : 'Unlock Ticket')
                .setStyle(isLocked ? ButtonStyle.Primary : ButtonStyle.Success);

            const messageComponents = interaction.message.components.map(row => {
                const actionRow = ActionRowBuilder.from(row);
                actionRow.components = row.components.map(component => {
                    if (component.customId === 'lock-ticket') return lockButton;
                    return component;
                });
                return actionRow;
            })

            const lockPermissions = [{
                    id: guild.id,
                    deny: [PermissionFlagsBits.SendMessages],
                }, {
                    id: user.id,
                    deny: [PermissionFlagsBits.SendMessages],
                }];

            const unlockPermissions = [{
                    id: guild.id,
                    allow: [PermissionFlagsBits.SendMessages],
                }, {
                    id: user.id,
                    allow: [PermissionFlagsBits.SendMessages],
                }];

            if (isLocked) {
                await channel.permissionOverwrites.set(unlockPermissions);
                await interaction.message.edit({ components: messageComponents });
                await interaction.deferUpdate();
                await interaction.followUp('The ticket has been unlocked');
            } else {
                await channel.permissionOverwrites.set(lockPermissions);
                await interaction.message.edit({ components: messageComponents });
                await interaction.deferUpdate();
                await interaction.followUp('The ticket has been locked.');
            }

        } catch (error) {
            console.error(`Error locking/unlocking ticket: ${error}`);
            await interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
            createLog('Error', `**Error**: ${error.message}`, interaction, 'error');

        }

    }
};