const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const Config = require('../Config.json');
const Functions = require('../others/functions');
const fs = require('fs');
const { channel } = require('diagnostics_channel');

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


        interaction.guild.channels.cache.forEach(channel => {
            if (channel.name == "rd-sound")
            {
                channel.delete();
            };
        });

        const Channel = await interaction.guild.channels.create({
            name: "rd-sound",
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.SendMessages],
                },
            ]
        }); 

        interaction.guild.fetchWebhooks().then((webhooks) => {
            webhooks.forEach((webhook) => {
                if (webhook.owner.id === client.user.id) 
                {
                    webhook.delete();
                };
            });
        }).catch(console.error);

        Channel.createWebhook({
            name: "RD-Sound",
            avatar: Config.bot.footerLogo
        }).then(async webhook => 
        {   
            Config.webhook = {id: webhook.id, token: webhook.token};

            fs.writeFileSync('./Config.json', JSON.stringify(Config, null, "\t"));

            let embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('Success')
            .setDescription(`Channel <#${Channel.id}> and Webhook was configured. Copy the webhook TOKEN that was sent to the DM or from the configuration file`)
            .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
            interaction.reply({content: "", embeds: [embed], ephemeral: false});

            let dmMessage = await interaction.author.send({content: `Webhook TOKEN: ||"${webhook.token}"||. Message delete in 10 sec`, ephemeral: true});

            setTimeout(() => dmMessage.delete(), 10000);
        }).catch(err =>
        {
            console.log(err);

            let embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('Error creating webhook')
            .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
            interaction.reply({content: "", embeds: [embed], ephemeral: false});
        });
    }
};