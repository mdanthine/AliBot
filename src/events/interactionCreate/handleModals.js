const fs = require('fs');
const getLocalInteractions = require('../../utils/getLocalInteractions');

module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;
    const { customId , channel, user, guild } = interaction;
    const modals = getLocalInteractions('modals');

    try {
        const modalObject = modals.find((modal) => modal.id === customId)
        await modalObject.callback(client, interaction);
    } catch (error) {
        console.log(`There was an error running this modal: ${error}`);
    }
};