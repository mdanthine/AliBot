const createLog = require('../../utils/createLog');
const { MessageAttachment } = require('discord.js');
const fs = require('fs');
const path = require('path');

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

            const messages = await channel.messages.fetch({ limit: 100 });
            const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
            let logText = `Conversation in ${channel.name}:\n\n`;

            sortedMessages.forEach(msg => {
                const timestamp = msg.createdAt.toLocaleString('en-GB', {
                    timeZone: 'GMT',
                    hour12: false,
                });
                logText += `[${timestamp}] ${msg.author.tag}: ${msg.content}\n`;
            });

            const filePath = path.join(__dirname, `${channel.name}-log.txt`);
            fs.writeFileSync(filePath, logText);

            createLog(
                'Ticket Deleted',
                `**Reason**: ${reason}`,
                interaction,
                'delete',
                filePath
            );

            await channel.delete();

            fs.unlinkSync(filePath);
        });
    }
};
