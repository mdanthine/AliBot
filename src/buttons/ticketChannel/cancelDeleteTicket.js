const createLog = require('../../utils/createLog');

module.exports = {
    id: "cancel-delete-ticket",
    
    callback: async (client, interaction) => {
        try {
            await interaction.update({
                content: 'Ticket deletion cancelled.',
                components: [],
                ephemeral: true,
            });
        } catch (error) {
            console.error(`Error cancelling ticket deletion: ${error}`);
            await interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
            createLog('Error', `**Error**: ${error.message}`, interaction, 'error');
        }
    }
}