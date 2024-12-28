const createLog = require('../../utils/createLog');

module.exports = {
    id: "cancel-delete-ticket",

    callback: async (client, interaction) => {
        try {
            await interaction.update({ 
                    content: 'Ticket deletion cancelled.', 
                    ephemeral: true 
                });
                
        } catch (error) {
            console.error(`Error cancelling ticket deletion: ${error}`);
            createLog(client, 'Error', `**Error**: ${error.message}`, interaction, 'error');
            await interaction.reply({ 
                    content: 'There was an error processing your request.', 
                    ephemeral: true 
                });
        }
    }
}