const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const removeFormat = require("../../utils/removeFormat");
const fetchApi = require("../../utils/fetchApi");

module.exports = {
    id: "current-mayor",
    callback: async (client, interaction) => {
        let mayorData = client.cachedMayorData;
        if (!mayorData) {
            mayorData = await fetchApi(`https://api.hypixel.net/v2/resources/skyblock/election?key=${apiKey}`);
        }        const actualMayor =  mayorData.mayor;
        const lastElection = mayorData.mayor.election;
        const currentElection = mayorData.current;

        const mayorTitle = `${actualMayor.name}`;
        let mayorDescription = "";
        const perks = actualMayor.perks;
        perks.forEach(perk => {
            mayorDescription += `**${perk.name}**: ${removeFormat(perk.description)}\n`
        });

        const mayorEmbed = new EmbedBuilder()
            .setTitle(mayorTitle)
            .setDescription(mayorDescription)

        const currentElectionButton = new ButtonBuilder()
            .setCustomId('current-election-chart')
            .setLabel('Current Election Chart')
            .setStyle(ButtonStyle.Primary)

        const lastElectionButton = new ButtonBuilder()
            .setCustomId('last-election-chart')
            .setLabel('Last Election Chart')
            .setStyle(ButtonStyle.Primary);
        
        const row = new ActionRowBuilder().addComponents(lastElectionButton, currentElectionButton);

        interaction.reply({ 
            embeds: [mayorEmbed], 
            components: [row],
            ephemeral: true,
        });
    }
}