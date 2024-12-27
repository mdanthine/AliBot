const { ModalSubmitInteraction } = require('discord.js');
const createLog = require('../../utils/createLog');
const fetchApi = require('../../utils/fetchApi');

module.exports = {
    id: 'discord-modal',
    callback: async (client, interaction) => {
        const { fields, user, channel } = interaction;

        const invite = fields.getTextInputValue('discordInvite');
        const categories = fields.getTextInputValue('discordCategories').split(',').map(cat => cat.trim());
        const tags = fields.getTextInputValue('discordTags').split(',').map(tag => tag.trim());
        const keyFeatures = fields.getTextInputValue('discordKeyFeatures').split(',').map(feature => feature.trim());

        const inviteCode = invite.split('/').pop();
        const data = await fetchApi(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`)
        
        const discordName = data.guild.name;
        const discordId = data.guild.id;
        const discordDesc = data.guild.description;
        const discordVanity = data.guild.vanity_url_code;
        
        const premiumMembers = data.guild.premium_subscription_count;
        const onlineMembers = data.approximate_presence_count;
        const totalMembers = data.approximate_member_count;

        await channel.send({
            content: 
                `Hello ${user}, please make sure that the following informations about your Discord server are correct:\n`+
                `• **Name: ${discordName}**\n` +
                `• **Id: ${discordId}**\n` +
                `• **Invite:** ${invite}\n` +
                `${discordVanity ? `• **Vanity Link:** ${discordVanity}` : ""}\n\n` +
                `• **Description**: ${discordDesc}\n\n` +
                `• **Categories:** ${categories.join(', ')}\n` +
                `• **Tags:** ${tags.join(', ')}\n` +
                `• **Key Features:** ${keyFeatures.join(', ')}\n\n` +
                `Your Discord Server has:\n` +
                `• Total members: ${totalMembers}\n` +
                `• Online Members: ${onlineMembers}\n` +
                `• Nitro Boosts: ${premiumMembers}\n`,
        });


        createLog(`Modal Submitted`, 'Discord Server Modal', interaction, 'create');

        interaction.reply({
            content: 'Details have been recorded.',
            ephemeral: true,
        });
    }
};