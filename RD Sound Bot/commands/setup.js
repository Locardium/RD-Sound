const { EmbedBuilder } = require('discord.js');
const Config = require('../Config.json');
const Functions = require('../others/functions');
const fs = require('fs');

module.exports = 
{
    Data: 
    {
        Name: "setup",
        Shortcuts: ["s"],
        Description: "Setup channel",
        DM: false,
        Inputs: [],
        Slash: true,
        OnlyBot: false
    },
    async Execute(client, interaction)
    {
        if (!Config.commands.permisions.admins.includes(Functions.GetUser(interaction).id))
        {
            let embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('You do not have permissions to use this command')
            .setFooter('RD Sound', Config.bot.footerLogo);
            return interaction.reply({content: "", embeds: [embed], ephemeral: true});
        };

        interaction.guild.fetchWebhooks().then((webhooks) => {
            webhooks.forEach((webhook) => {
                if (webhook.owner.id === client.user.id) 
                {
                    webhook.delete();
                };
            });
        }).catch(console.error);

        const Channel = client.channels.cache.get(interaction.channelId);

        Channel.createWebhook({
            name: "RD-Sound",
            avatar: Config.bot.footerLogo
        }).then(webhook => 
        {   
            Config.webhook = {id: webhook.id, token: webhook.token};

            fs.writeFileSync('./Config.json', JSON.stringify(Config, null, "\t"));

            let embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('Success')
            .setDescription('this channel was configured')
            .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
            interaction.reply({content: "", embeds: [embed], ephemeral: false});
        }).catch(err =>
        {
            console.log(err);

            let embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('this channel was configured')
            .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
            interaction.reply({content: "", embeds: [embed], ephemeral: false});
        });
    }
};