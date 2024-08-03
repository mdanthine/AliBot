const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const createLog = require('../../utils/createLog');

module.exports = {
    id: "lock-ticket",
    callback: async (client, interaction) => {
        const { channel, user, guild } = interaction;

        const channelPermissions = await channel.permissionOverwrites.cache;
        const isLocked = channelPermissions.some(permission =>
            (permission.id === guild.id && !permission.allow.has(PermissionFlagsBits.SendMessages))
        );

        const lockButton = new ButtonBuilder()
            .setCustomId('lock-ticket')
            .setLabel(isLocked ? 'Lock Ticket' : 'Unlock Ticket')
            .setStyle(isLocked ? ButtonStyle.Primary : ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(lockButton);

        const lockPermissions = [
            {
                id: guild.id,
                deny: [PermissionFlagsBits.SendMessages],
            },
            {
                id: user.id,
                deny: [PermissionFlagsBits.SendMessages],
            },
        ];

        const unlockPermissions = [
            {
                id: guild.id,
                allow: [PermissionFlagsBits.SendMessages],
            },
            {
                id: user.id,
                allow: [PermissionFlagsBits.SendMessages],
            },
        ];

        if (isLocked) {
            await channel.permissionOverwrites.set(unlockPermissions);
            await interaction.reply({
                content: 'Ticket unlocked.',
                ephemeral: true,
                components: [row],
            });
            createLog(`Ticket unlocked by [${user.globalName}] = [${user.id}] in ${channel.name}`, interaction);
        } else {
            await channel.permissionOverwrites.set(lockPermissions);
            await interaction.reply({
                content: 'Ticket locked.',
                ephemeral: true,
                components: [row],
            });
            createLog(`Ticket locked by [${user.globalName}] = [${user.id}] in ${channel.name}`, interaction);
        }
    }
}