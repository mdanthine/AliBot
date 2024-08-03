const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const QuickChart = require('quickchart-js');
const fetchApi = require("../../utils/fetchApi")
const candidateColors = {
    "Aatrox": "#FF5555",
    "Cole": "#AAAAAA",
    "Diana": "#00AA00",
    "Diaz": "#FFAA00",
    "Finnegan": "#55FF55",
    "Foxy": "#55FFFF",
    "Marina": "#0000AA",
    "Paul": "#AA0000",

    "Jerry": "#FF55FF",
    "Derpy": "#FF55FF",
    "Scorpius": "#FF55FF",
};


module.exports = {
    id: "last-election-chart",
    callback: async (client, interaction) => {
        let mayorData = client.cachedMayorData;
        if (!mayorData) {
            mayorData = await fetchApi(`https://api.hypixel.net/v2/resources/skyblock/election?key=${apiKey}`);
        }
        const lastElection = mayorData.mayor.election;
        const year = lastElection.year;
        const candidates = lastElection.candidates;

        const chart = new QuickChart();
        const chartColors = candidates.map(candidate => candidateColors[candidate.name] || '#ffffff');
        chart.setConfig({
            type: 'bar',
            data: {
                labels: candidates.map(candidate => candidate.name),
                datasets: [{
                    label: "Vote count",
                    data: candidates.map(candidate => candidate.votes),
                    backgroundColor: chartColors
                }]
            }
        })
            .setWidth(500)
            .setHeight(300)
            .setBackgroundColor("#151515")

        const chartUrl = await chart.getShortUrl();
        const embed = new EmbedBuilder()
            .setTitle("Last year election chart")
            .setDescription(`Year ${year}`)
            .setImage(chartUrl)
        
        
        const currentMayorButton = new ButtonBuilder()
            .setCustomId('current-mayor')
            .setLabel('Current Mayor')
            .setStyle(ButtonStyle.Primary)

        const lastCandidatesButton = new ButtonBuilder()
            .setCustomId('last-candidates-list')
            .setLabel('Last Candidates List')
            .setStyle(ButtonStyle.Primary)
        
        const currentElectionButton = new ButtonBuilder()
            .setCustomId('current-election-chart')
            .setLabel('Current Election Chart')
            .setStyle(ButtonStyle.Primary)
        
        const row = new ActionRowBuilder().addComponents(currentMayorButton, lastCandidatesButton, currentElectionButton);

        interaction.update({
            embeds: [embed],
            components: [row],
        })

    }
}