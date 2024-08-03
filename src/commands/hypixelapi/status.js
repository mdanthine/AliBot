const { ApplicationCommandOptionType } = require("discord.js");
const convertToDiscordTimestamp = require("../../utils/convertToDiscordTimestamp");
const capitalizeWords = require("../../utils/capitalizeWords");
const fetchApi = require("../../utils/fetchApi");

const apiKey = process.env.HYPIXEL_API;

module.exports = {
    name: "status",
    description: "Check the status of a player on Hypixel",
    options: [
        {
            name: "player",
            description: "Player name",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        const playerName = interaction.options.getString("player");

        try {
            const mojangData = await fetchApi(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
            const { id: uuid } = mojangData || {};
            if (!uuid) {
                return interaction.reply({
                    content: `Couldn't find any player with the name ${playerName}`,
                    ephemeral: true,
                });
            }

            const [statusData, playerData] = await Promise.all([
                fetchApi(`https://api.hypixel.net/v2/status?key=${apiKey}&uuid=${uuid}`),
                fetchApi(`https://api.hypixel.net/v2/player?key=${apiKey}&uuid=${uuid}`),
            ]);

            const online = statusData?.session?.online;
            const gametype = capitalizeWords(statusData?.session?.gameType || "");
            const gamemode = capitalizeWords((statusData?.session?.mode || "").replace("_", " "));
            const lastPlayed = capitalizeWords(playerData?.player?.mostRecentGameType || "");
            const lastLogin = playerData?.player?.lastLogin;
            const timePlayed = convertToDiscordTimestamp(lastLogin, "R");

            let statusMessage = `${online ? "🟢" : "🔴"} ${playerName}`;
            if (online) {
                statusMessage += `\nPlaying ${gametype} | ${gamemode}\nSince: ${timePlayed}`;
            } else {
                statusMessage += `\nLast login: ${timePlayed}`;
                if (lastPlayed) {
                    statusMessage += `\nLast gamemode: ${lastPlayed}`;
                }
            }

            interaction.reply({ content: statusMessage });

        } catch (error) {
            console.error(`Error fetching player data:`, error);
            interaction.reply({
                content: `There was an error checking the status of ${playerName}. Please try again later.`,
                ephemeral: true,
            });
        }
    }
};
