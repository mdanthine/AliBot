const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const createLog = require('../../utils/createLog');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;
    const { customId, channel, user, guild } = interaction;
    if (customId === 'delete-ticket') {

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('confirm-delete-ticket')
                .setLabel('Yes')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('cancel-delete-ticket')
                .setLabel('No')
                .setStyle(ButtonStyle.Success)
        );

        const confirmation = await interaction.reply({
            content: 'Are you sure you want to delete this ticket? Respond with yes or no.', 
            components: [row],
            ephemeral: true,
        });

    } else if (customId === 'confirm-delete-ticket') {
        await interaction.update({
            content: 'Please provide a reason for deleting the ticket.',
            components: [],
            ephemeral: true,
        });

        const filter = response => response.author.id === user.id;
        const reasonCollector = channel.createMessageCollector({ filter, max: 1, time: 15000 });

        reasonCollector.on('collect', async reasonMessage => {
            const reason = reasonMessage.content;
            createLog(`Ticket deleted by [${user.globalName}] = [${user.id}], **Reason**: ${reason}`, interaction)
            await channel.delete();
        });

    } else if (customId === 'cancel-delete-ticket') {
        await interaction.update({
            content: 'Ticket deletion cancelled.',
            compontents: [],
            ephemeral: true,
        });
        
    } else if (customId === 'lock-ticket') {
        const channelPermissions = await channel.permissionOverwrites.cache;
        const isLocked = channelPermissions.some(permission =>
            (permission.id === guild.id && !permission.allow.has(PermissionFlagsBits.SendMessages))
        );


        const lockButton =  new ButtonBuilder()
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
                alow: [PermissionFlagsBits.SendMessages]
            }
        ]

        if (isLocked) {
            await channel.permissionOverwrites.set(unlockPermissions);
            await interaction.reply({
                content: 'Ticket unlocked.',
                ephemeral: true,
                components: [row],
            });

            createLog(`Ticket unlocked by [${user.globalName}] = [${user.id}] in ${channel.name}`,interaction);
        } else {
            await channel.permissionOverwrites.set(lockPermissions);
            await interaction.reply({
                content: 'Ticket locked',
                ephemeral: true,
                components: [row],
            });
            createLog(`Ticket locked by [${user.globalName}] = [${user.id}] in ${channel.name}`, interaction);
        }
    }
}