const fs = require('fs');
const getLocalButtons = require('../../utils/getLocalButtons');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;
    const { customId , channel, user, guild } = interaction;
    const buttons = getLocalButtons();

    try {
        const buttonObject = buttons.find((btn) => btn.id === customId)
        await buttonObject.callback(client, interaction);
    } catch (error) {
        console.log(`There was an error running this button: ${error}`);
    }
};