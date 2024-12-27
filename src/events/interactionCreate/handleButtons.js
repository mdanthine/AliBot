const fs = require('fs');
const getLocalInteractions = require('../../utils/getLocalInteractions');

module.exports = async (client, interaction, logger) => {
    if (!interaction.isButton()) return;
    const { customId , channel, user, guild } = interaction;
    const buttons = getLocalInteractions('buttons');

    try {
        const buttonObject = buttons.find((btn) => btn.id === customId)
        await buttonObject.callback(client, interaction);
    } catch (error) {
        console.error(`There was an error running this button: ${error}`);
    }
};