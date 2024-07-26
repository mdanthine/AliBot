const { channel , ChannelType } = require('discord.js');

module.exports = async (message, interaction) => {
    const { user, guild } = interaction;
    const logChannel = guild.channels.cache.find(ch => ch.name === 'ticket-log' && ch.type === ChannelType.GuildText);
    if (!logChannel) return;
    logChannel.send(message);
}