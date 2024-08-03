module.exports = {
    id: "cancel-delete-ticket",
    callback: async (client, interaction) => {
        interaction.update({
            content: 'Ticket deletion cancelled.',
            components: [],
            ephemeral: true,
        });
    }
}