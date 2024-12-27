const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    id: "discord-ticket",
    callback: async (client, interaction) => {
        const { channel, user } = interaction;

        const modal = new ModalBuilder()
            .setCustomId('discord-modal')
            .setTitle('Discord Server Details');

        const inviteInput = new TextInputBuilder()
            .setCustomId('discordInvite')
            .setLabel('Discord Invite Link')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const categoriesInput = new TextInputBuilder()
            .setCustomId('discordCategories')
            .setLabel('Categories (comma-separated)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const tagsInput = new TextInputBuilder()
            .setCustomId('discordTags')
            .setLabel('Tags (comma-separated)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const keyFeaturesInput = new TextInputBuilder()
            .setCustomId('discordKeyFeatures')
            .setLabel('Key features (comma-separated)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(inviteInput),
            new ActionRowBuilder().addComponents(categoriesInput),
            new ActionRowBuilder().addComponents(tagsInput),
            new ActionRowBuilder().addComponents(keyFeaturesInput)
        );
        await interaction.showModal(modal);
    }
}
