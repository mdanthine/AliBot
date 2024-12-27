const { EmbedBuilder, ChannelType, AttachmentBuilder } = require('discord.js');
const { ticketLogChannel } = require('../../config.json')
module.exports = async (title, action, interaction, actionType, filePath = null) => {
    const { user, guild } = interaction;
    const logChannel = await client.channels.fetch(ticketLogChannel);

    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(action)
        .setColor(getActionColor(actionType))
        .addFields(
            { name: 'User', value: `<@${user.id}> (${user.tag})`, inline: true },
            { name: 'Channel', value: interaction.channel ? `<#${interaction.channel.id}> ${interaction.channel.name}` : 'Unknown', inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Ticket System Log' });

    const messageOptions = { embeds: [embed] };

    if (filePath) {
        const attachment = new AttachmentBuilder(filePath);
        messageOptions.files = [attachment];
    }

    logChannel.send(messageOptions);
};

function getActionColor(actionType) {
    switch (actionType.toLowerCase()) {
        case 'create':
            return 0x00FF00;
        case 'delete':
            return 0xFF0000;
        case 'info':
            return 0x0000FF;
        default:
            return 0x808080;
    }
}
