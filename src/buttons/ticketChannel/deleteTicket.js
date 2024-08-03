const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    id: "delete-ticket",
    callback: async (client, interaction) => {
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
    
        await interaction.reply({
            content: 'Are you sure you want to delete this ticket? Respond with yes or no.',
            components: [row],
            ephemeral: true,
        });
    }
}
