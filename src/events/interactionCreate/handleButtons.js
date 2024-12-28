const getLocalInteractions = require('../../utils/getLocalInteractions');

module.exports = async (client, interaction, logger) => {
    if (!interaction.isButton()) return;
    const { customId } = interaction;
    const buttons = getLocalInteractions('buttons');

    try {
        const buttonObject = buttons.find((btn) => btn.id === customId)
        if (!buttonObject) return;
        
        await buttonObject.callback(client, interaction);

    } catch (error) {
        console.error(`There was an error running this button: ${error}`);
    }
};