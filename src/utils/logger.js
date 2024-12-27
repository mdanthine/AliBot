const { EmbedBuilder } = require('discord.js');
const { logChannel } = require('../../config.json');

const logLevels = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    FATAL: 'FATAL'
};

function createLogger(client) {
    async function log(level, message, context = {}, interaction = null) {
        try {
            const logEntry = {
                level,
                message,
                ...context
            };

            if (!interaction) return
            logEntry.userId = interaction.user?.id || 'Unknown';
            logEntry.userName = interaction.user?.tag || 'Unknown';
            logEntry.channelName = interaction.channel ? interaction.channel.name : 'Unknown';
            logEntry.channelId = interaction.channel.id ? interaction.channel.id : '';

            if (interaction.isCommand()) {
                if (level === logLevels.INFO) return;
                logEntry.logType = 'Command';
            } else if (interaction.isMessageComponent()) {
                if (level === logLevels.INFO) return;
                logEntry.logType = 'Component';
            } else if (interaction.isModalSubmit()) {
                logEntry.logType = 'Modal';
            } else {
                logEntry.logType = 'Unknown';
            }
            

            const embed = new EmbedBuilder()
                .setTitle(logEntry.logType)
                .setDescription(message)
                .setColor(getLogColor(level))
                .addFields(
                    { name: 'User', value: `${logEntry.userName} - ${logEntry.userId}`, inline: true },
                    { name: 'Channel', value: `${logEntry.channelName} - ${logEntry.channelId}`, inline: false },
                    ...Object.keys(context).map(key => ({ name: key, value: context[key], inline: true }))
                )
                .setTimestamp()
                .setFooter({ text: 'Alibot log' });

            const channel = await client.channels.fetch(logChannel);
            if (!channel) {
                throw new Error('Log channel not found');
            }

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to send log:', error);
        }
    }

    function getLogColor(level) {
        switch (level) {
            case logLevels.INFO:
                return 0x00FF00;
            case logLevels.WARN:
                return 0xFFFF00;
            case logLevels.ERROR:
                return 0xFF0000;
            case logLevels.FATAL:
                return 0x8B0000;
            default:
                return 0x808080;
        }
    }

    return {
        info: (interaction, message, context) => log(logLevels.INFO, message, context, interaction),
        warn: (interaction, message, context) => log(logLevels.WARN, message, context, interaction),
        error: (interaction, message, context) => log(logLevels.ERROR, message, context, interaction),
        fatal: (interaction, message, context) => log(logLevels.FATAL, message, context, interaction)
    };
}

module.exports = createLogger;