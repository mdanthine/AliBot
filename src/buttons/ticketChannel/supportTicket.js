const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const createLog = require('../../utils/createLog');

module.exports = {
    id: "support-ticket",
    
    callback: async (client, interaction) => {
        try {
            const modal = new ModalBuilder()
                .setCustomId('support-modal')
                .setTitle('Support Ticket');

            const issueObject = new TextInputBuilder()
                .setCustomId('supportObject')
                .setLabel('What is the object of your issue ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const issueInput = new TextInputBuilder()
                .setCustomId('supportIssue')
                .setLabel('Describe your issue:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(issueObject),
                new ActionRowBuilder().addComponents(issueInput)
            );

            await interaction.showModal(modal);
        } catch (error) {
            console.error(`Error showing Support Ticket modal: ${error}`);
            await interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
            createLog('Error', `**Error**: ${error.message}`, interaction, 'error');
        }
    }
}
