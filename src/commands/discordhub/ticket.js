const { ApplicationCommandOptionType, PermissionFlagsBits, ChannelType, PermissionOverwrites, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { description, permissionsRequired, botPermissions } = require('./addServer');
const createLog = require('../../utils/createLog');

module.exports = {
    testOnly: true,
    name: "openticket",
    description: "Opens a ticket channel for presenting your Discord server.",
    options: [
        {
            name: 'invite',
            description: "Invite link of the Discord server",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'categories',
            description: 'Categories of the server, separated by commas',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'tags',
            description: 'Tags of the server, separated by commas',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'keyfeatures',
            description: 'Key features of the server, separated by commas',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        const { guild, user } = interaction;

        const existingTicket = guild.channels.cache.find(channel => channel.name === `ticket-${user.username}`);
        if (existingTicket) {
            interaction.reply({
                content: "You already have an open ticket.",
                ephemeral: true,
            });
            return;
        }

        const invite = interaction.options.getString('invite');
        const categories = interaction.options.getString('categories').split(',');
        const tags = interaction.options.getString('tags').split(',');
        const keyFeatures = interaction.options.getString('keyfeatures').split(',');

        try {
        
            const channel = await guild.channels.create({
                name: `ticket-${user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                        allow: [PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: user.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                ],
            });

            const deleteButton = new ButtonBuilder()
                .setCustomId('delete-ticket')
                .setLabel('Delete Ticket')
                .setStyle(ButtonStyle.Danger);

            const lockButton = new ButtonBuilder()
                .setCustomId('lock-ticket')
                .setLabel('Lock Ticket')
                .setStyle(ButtonStyle.Primary)

            const row = new ActionRowBuilder()
                .addComponents(deleteButton, lockButton);


            
            const inviteCode = invite.split('/').pop();
            const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`);
            const data = await response.json();
            
            const discordName = data.guild.name;
            const discordId = data.guild.id;
            const discordDesc = data.guild.description;
            const discordVanity = data.guild.vanity_url_code;
            
            const premiumMembers = data.guild.premium_subscription_count;
            const onlineMembers = data.approximate_presence_count;
            const totalMembers = data.approximate_member_count;

            await channel.send({
                content: 
`Hello ${user}, please make sure that the following informations about your Discord server are correct:
• **Name: ${discordName}**
• **Id: ${discordId}**

• **Invite:** ${invite}
${discordVanity ? `• **Vanity Link:** ${discordVanity}` : ""}

• **Description**: ${discordDesc}

• **Categories:** ${categories.join(', ')}
• **Tags:** ${tags.join(', ')}
• **Key Features:** ${keyFeatures.join(', ')}

Your Discord Server has:
• Total members: ${totalMembers}
• Online Members: ${onlineMembers}
• Nitro Boosts: ${premiumMembers}
`, 
                components: [row],
            });
            
                interaction.reply({
                    content: `Ticket created: ${channel}`,
                    ephemeral: true,
                }); 

                createLog(`Ticket created by [${user.globalName}] = [${user.id}] in ${channel.name}`, interaction)
            } catch (error) {
            console.log(`Error creating ticket channel: ${error}`);
            interaction.reply({
                content: 'There was an error creating the ticket channel. Please try again later.',
                ephemeral: true,
            });
        };
    },
};