const getLocalInteractions = require('../../utils/getLocalInteractions');

module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;
    const { customId  } = interaction;
    const modals = getLocalInteractions('modals');

    try {
        const modalObject = modals.find((modal) => modal.id === customId)
        if (!modalObject) return;

        await modalObject.callback(client, interaction);

    } catch (error) {
        console.log(`There was an error running this modal: ${error}`);
    }
};