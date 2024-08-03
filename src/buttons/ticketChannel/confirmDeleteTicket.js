const createLog = require('../../utils/createLog');

module.exports = {
    id: "confirm-delete-ticket",
    callback: async (client, interaction) => {
        const { channel, user } = interaction;
    
        await interaction.update({
            content: 'Please provide a reason for deleting the ticket.',
            components: [],
            ephemeral: true,
        });
    
        const filter = response => response.author.id === user.id;
        const reasonCollector = channel.createMessageCollector({ filter, max: 1, time: 15000 });
    
        reasonCollector.on('collect', async reasonMessage => {
            const reason = reasonMessage.content;
            createLog(`Ticket deleted by [${user.globalName}] = [${user.id}], **Reason**: ${reason}`, interaction);
            await channel.delete();
        });
    }
}
    
