const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const removeFormat = require("../../utils/removeFormat");
const fetchApi = require("../../utils/fetchApi");

module.exports = {
    id: "last-candidates-list",
    callback: async (client, interaction) => {
        let mayorData = client.cachedMayorData;
        if (!mayorData) {
            mayorData = await fetchApi(`https://api.hypixel.net/v2/resources/skyblock/election?key=${apiKey}`);
        }
        const lastElection = mayorData.mayor.election;
        const year = lastElection.year;
        const candidates = lastElection.candidates;

        let embedDescription = "";
        candidates.forEach(candidate => {
            embedDescription += `\n**${candidate.name}**: ${candidate.votes} Votes\n`
            candidate.perks.forEach(perk => {
                embedDescription += `__${perk.name}__: ${removeFormat(perk.description)}\n`
            })
        });

        const embed = new EmbedBuilder()
            .setTitle(`Last year candidates list (Year ${year})`)
            .setDescription(embedDescription)
        
        const currentMayorButton = new ButtonBuilder()
            .setCustomId('current-mayor')
            .setLabel('Current Mayor')
            .setStyle(ButtonStyle.Primary)

        const lastElectionButton = new ButtonBuilder()
            .setCustomId('last-election-chart')
            .setLabel('Last Election Chart')
            .setStyle(ButtonStyle.Primary)
        
        const currentElectionButton = new ButtonBuilder()
            .setCustomId('current-election-chart')
            .setLabel('Current Election Chart')
            .setStyle(ButtonStyle.Primary)
        
        const row = new ActionRowBuilder().addComponents(currentMayorButton, lastElectionButton, currentElectionButton);
        interaction.update({
            embeds: [embed],
            components: [row]
        })
    }
}