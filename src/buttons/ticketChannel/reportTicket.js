const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const createLog = require('../../utils/createLog');

module.exports = {
    id: "report-ticket",
    
    callback: async (client, interaction) => {
        try {
            const modal = new ModalBuilder()
                .setCustomId('report-modal')
                .setTitle('Bug Report');
            
            const bugObject = new TextInputBuilder()
                .setCustomId('reportObject')
                .setLabel('What is your report ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const bugInput = new TextInputBuilder()
                .setCustomId('reportBug')
                .setLabel('Describe what you want to report')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(bugObject),
                new ActionRowBuilder().addComponents(bugInput)
            );

            await interaction.showModal(modal);
        } catch (error) {
            console.error(`Error showing Bug Report modal: ${error}`);
            await interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
            createLog('Error', `**Error**: ${error.message}`, interaction, 'error');   
        }
    }
}
