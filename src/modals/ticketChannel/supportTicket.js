const createLog = require('../../utils/createLog');

module.exports = {
    id: 'support-modal',
    callback: async (client, interaction) => {
        const { fields, user, channel } = interaction;

        const supportObject = fields.getTextInputValue('supportObject');
        const supportIssue = fields.getTextInputValue('supportIssue');

        await channel.send({
            content: 
                `Hello ${user}, please make sure that the following informations about your issue are correct:\n` +
                `**Object:** ${supportObject}\n` +
                `Issue: ${supportIssue}`,
        });

        createLog(`Modal Submitted`, 'Support Modal', interaction, 'create');
        
        interaction.reply({
            content: 'Your support issue has been recorded. Our team will get back to you shortly.',
            ephemeral: true,
        });
    }
};
