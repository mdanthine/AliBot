const createLog = require('../../utils/createLog');
const fs = require('fs');
const path = require('path');

module.exports = {
    id: 'support-modal',

    callback: async (client, interaction) => {
        const { fields, user, channel } = interaction;

        try {
            const supportObject = fields.getTextInputValue('supportObject');
            const supportIssue = fields.getTextInputValue('supportIssue');

            const logText = 
                `Support Modal Submission:\n\n` +
                `User: ${user.tag} (${user.id})\n` +
                `Channel: ${channel.name} (${channel.id})\n\n` +
                `Object: ${supportObject}\n` +
                `Issue: ${supportIssue}\n`;

            const filePath = path.join(__dirname, `${channel.name}-support-log.txt`);
            fs.writeFileSync(filePath, logText);

            await channel.send({
                content: 
                    `Hello ${user}, please make sure that the following informations about your issue are correct:\n` +
                    `**Object:** ${supportObject}\n` +
                    `Issue: ${supportIssue}`,
            });

            createLog(client, `Modal Submitted`, 'Support Modal', interaction, 'create', filePath);
            
            await interaction.reply({ 
                content: 'Your support issue has been recorded. Our team will get back to you shortly.', 
                ephemeral: true 
            });

            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(`Error processing support modal: ${error}`);
            createLog(client, 'Error', `**Error**: ${error.message}`, interaction, 'error');
            await interaction.reply({ 
                content: 'There was an error processing your request.', 
                ephemeral: true 
            });
        }
    }
};