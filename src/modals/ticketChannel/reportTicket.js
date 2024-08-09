const createLog = require('../../utils/createLog');

module.exports = {
    id: 'report-modal',
    callback: async (client, interaction) => {
        const { fields, user, channel } = interaction;

        const reportObject = fields.getTextInputValue('reportObject');
        const reportBug = fields.getTextInputValue('reportBug');

        await channel.send({
            content: 
`Hello ${user}, please make sure that the following informations about your issue are correct:
**Object:** ${reportObject}
Report: ${reportBug}`,
        });

        createLog(`Modal Submitted`, 'Report Modal', interaction, 'create');

        interaction.reply({
            content: 'Your bug report has been recorded. Our team will investigate the issue.',
            ephemeral: true,
        });
    }
};
