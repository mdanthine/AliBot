const createLog = require('../../utils/createLog');
const fs = require('fs');
const path = require('path');

module.exports = {
    id: 'report-modal',

    callback: async (client, interaction) => {
        const { fields, user, channel } = interaction;

        try {
            const reportObject = fields.getTextInputValue('reportObject');
            const reportBug = fields.getTextInputValue('reportBug');

            const logText = 
                `Report Modal Submission:\n\n` +
                `User: ${user.tag} (${user.id})\n` +
                `Channel: ${channel.name} (${channel.id})\n\n` +
                `Object: ${reportObject}\n` +
                `Report: ${reportBug}\n`;

            const filePath = path.join(__dirname, `${channel.name}-report-log.txt`);
            fs.writeFileSync(filePath, logText);

            await channel.send({
                content: 
                    `Hello ${user}, please make sure that the following informations about your issue are correct:\n` +
                    `**Object:** ${reportObject}\n` +
                    `Report: ${reportBug}`,
            });

            createLog(client, `Modal Submitted`, 'Report Modal', interaction, 'create', filePath);

            await interaction.reply({
                content: 'Your bug report has been recorded. Our team will investigate the issue.',
                ephemeral: true,
            });

            fs.unlinkSync(filePath);

        } catch (error) {
            console.error(`Error processing report modal: ${error}`);
            createLog(client, 'Error', `**Error**: ${error.message}`, interaction, 'error');
            await interaction.reply({ 
                content: 'There was an error processing your request.', 
                ephemeral: true 
            });
        }
    }
};