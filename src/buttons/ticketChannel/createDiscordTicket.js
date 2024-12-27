const { ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: 'create-discord-ticket',
    callback: async (client, interaction) => {
        const { guild, user } = interaction;
        const existingTicket = guild.channels.cache.find(channel => channel.name === `ticket-discord-${user.username}`);
        if (existingTicket) {
            return interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
        }

        try {
            const channel = await guild.channels.create({
                name: `ticket-discord-${user.username}`,
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
            
            const discordButton = new ButtonBuilder()
                .setCustomId('discord-ticket')
                .setLabel('Discord Server Form')
                .setStyle(ButtonStyle.Success)
            
            const row = new ActionRowBuilder().addComponents(discordButton, lockButton, deleteButton);
            
            await channel.send({
                content: `Hello ${user}. Thank you for creating a ticket. If you created this ticket, then you're looking forward to add your server to our list. Please click on the button to provide more informations about your server.
                \n - Categories can be: dedicated-grinds, mods, communities, content-creators, guilds
                \n - Tags can be: : mining, bestiary, money , carry, guild, content creator, mod...
                \n - Key features can be anything that defines your server`,
                components: [row],
            });

            
        } catch (error) {
            console.error(`Error creating discord ticket channel: ${error}`);
            interaction.reply({ content: 'There was an error creating the ticket', ephemeral: true});
        }
    }
}