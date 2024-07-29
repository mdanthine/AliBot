const { ApplicationCommandOptionType } = require("discord.js")
const { description, callback } = require("../discordhub/addServer")

const convertToDiscordTimestamp = require("../../utils/convertToDiscordTimestamp")
const capitalizeWords = require("../../utils/capitalizeWords");
const fetchApi = require("../../utils/fetchApi");

const apiKey = process.env.HYPIXEL_API

module.exports = {
    name: "status",
    description: "Check the status of a player on Hypixel",
    options: [
        {
            name: "player",
            description: "Player name",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    callback: async (client, interaction) => {
        const playerName = interaction.options.getString("player");

        try {
            const mojangData = await fetchApi(`https://api.mojang.com/users/profiles/minecraft/${playerName}`)
            const uuid = mojangData.id;
            if (!mojangData.id) {
                interaction.reply({
                    content: `Couldn't find any player with the name ${playerName}`,
                    ephemeral: true,
                })
                return;
            }

            const statusData = await fetchApi(`https://api.hypixel.net/v2/status?key=${apiKey}&uuid=${uuid}`);
            const playerData = await fetchApi(`https://api.hypixel.net/v2/player?key=${apiKey}&uuid=${uuid}`);
            const online = statusData.session.online;
            const gametype = statusData.session.gameType;
            const gamemode = statusData.session.mode;
            const lastPlayed = playerData.player.mostRecentGameType;
            const lastLogin = playerData.player.lastLogin;
            const timePlayed = convertToDiscordTimestamp(lastLogin, "R");
            

            let statusMessage = `${statusData.session.online ? "🟢" : "🔴"} ${playerName}`;
            if (online) {
                statusMessage += `\nPlaying ${capitalizeWords(gametype ? statusData.session.gameType : "")} | ${gamemode ? capitalizeWords(gamemode.replace("_"," ")) : ""}`
                statusMessage += `\nSince: ${timePlayed}`;
            } else {
                statusMessage += `\nLast login: ${timePlayed}`;
                if (lastPlayed) {
                    statusMessage += `\nLast gamemode: ${capitalizeWords(lastPlayed)}`;
                }
            }

            interaction.reply({ content: statusMessage })

        } catch (error) {
            console.error(`Error fetching player data:`, error);
            interaction.reply({
                content: `There was an error checking the status of ${playerName}. Please try again later.`,
                ephemeral: true,
            });
        }

    }
}