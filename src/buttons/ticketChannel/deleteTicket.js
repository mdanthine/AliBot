const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const createLog = require('../../utils/createLog');

module.exports = {
    id: "delete-ticket",
    
    callback: async (client, interaction) => {
        try {
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
        } catch (error) {
            console.error(`Error intiating ticket deletion: ${error}`);
            await interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
            createLog('Error', `**Error**: ${error.message}`, interaction, 'error');
        }
    }
}
