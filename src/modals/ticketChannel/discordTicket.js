const createLog = require('../../utils/createLog');
const fetchApi = require('../../utils/fetchApi');
const path = require('path');
const fs = require('fs');

module.exports = {
    id: 'discord-modal',

    callback: async (client, interaction) => {
        const { fields, user, channel } = interaction;

        try {
            const invite = fields.getTextInputValue('discordInvite');
            const categories = fields.getTextInputValue('discordCategories').split(',').map(cat => cat.trim());
            const tags = fields.getTextInputValue('discordTags').split(',').map(tag => tag.trim());
            const keyFeatures = fields.getTextInputValue('discordKeyFeatures').split(',').map(feature => feature.trim());

            const inviteCode = invite.split('/').pop();
            const data = await fetchApi(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`);
            if (!data) throw new Error('Invalid invite link.');
            
            const discordName = data.guild.name;
            const discordId = data.guild.id;
            const discordDesc = data.guild.description;
            const discordVanity = data.guild.vanity_url_code;

            const premiumMembers = data.guild.premium_subscription_count;
            const onlineMembers = data.approximate_presence_count;
            const totalMembers = data.approximate_member_count;

            const logText = 
                `Discord Modal Submission:\n\n` +
                `User: ${user.tag} (${user.id})\n` +
                `Channel: ${channel.name} (${channel.id})\n\n` +
                `Name: ${discordName}\n` +
                `Id: ${discordId}\n` +
                `Invite: ${invite}\n` +
                `${discordVanity ? `Vanity Link: ${discordVanity}\n` : ""}` +
                `Description: ${discordDesc}\n` +
                `Categories: ${categories.join(', ')}\n` +
                `Tags: ${tags.join(', ')}\n` +
                `Key Features: ${keyFeatures.join(', ')}\n` +
                `Total members: ${totalMembers}\n` +
                `Online Members: ${onlineMembers}\n` +
                `Nitro Boosts: ${premiumMembers}\n`;

            const filePath = path.join(__dirname, `${channel.name}-discord-log.txt`);
            fs.writeFileSync(filePath, logText);

            await channel.send({
                content: 
                    `Hello ${user}, please make sure that the following informations about your Discord server are correct:\n` +
                    `\`\`\`\n` +
                    `• Name: ${discordName}\n` +
                    `• Id: ${discordId}\n` +
                    `• Invite: ${invite}\n` +
                    `${discordVanity ? `• Vanity Link: ${discordVanity}\n` : ""}` +
                    `• Description: ${discordDesc}\n` +
                    `• Categories: ${categories.join(', ')}\n` +
                    `• Tags: ${tags.join(', ')}\n` +
                    `• Key Features: ${keyFeatures.join(', ')}\n` +
                    `\nYour Discord Server has:\n` +
                    `• Total members: ${totalMembers}\n` +
                    `• Online Members: ${onlineMembers}\n` +
                    `• Nitro Boosts: ${premiumMembers}\n` +
                    `\`\`\``,
            });

            createLog(client, `Modal Submitted`, 'Discord Server Modal', interaction, 'create', filePath);

            await interaction.reply({
                content: 'Details have been recorded.',
                ephemeral: true,
            });

            fs.unlinkSync(filePath);
            
        } catch (error) {
            console.error(`Error processing discord modal: ${error}`);
            createLog(client, 'Error', `**Error**: ${error.message}`, interaction, 'error');
            await interaction.reply({
                 content: 'There was an error processing your request.', 
                 ephemeral: true
            });
        }
    }
};