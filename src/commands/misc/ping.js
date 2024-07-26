module.exports = {
    name: 'ping',
    description: 'Pong!',
    // testOnly: true,
    // devOnly: Boolean,
    // options: Object[],
    deleted: true,
  
    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    },
  };