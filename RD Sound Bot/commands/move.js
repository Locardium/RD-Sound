const { EmbedBuilder } = require('discord.js');
const Config = require('../Config.json');
const Functions = require('../others/functions');
const keygen = require("keygenerator");
const fs = require('fs');

module.exports = 
{
    Data: 
    {
        Name: "move",
        Shortcuts: [],
        Description: "Move user to other voice channel",
        DM: false,
        Inputs: [
            {type: 3, name: "user", id: 1, description: "Discord ID", required: true},
            {type: 3, name: "channel", id: 2, description: "Channel ID", required: true}
        ],
        Slash: false,
        OnlyBot: true
    },
    async Execute(client, interaction)
    {
        let UserArg = Functions.CheckArgs(interaction, this.Data.Inputs.filter(x => x.name == "user"));
        let ChannelArg = Functions.CheckArgs(interaction, this.Data.Inputs.filter(x => x.name == "channel"));

        if (!UserArg) return interaction.reply({content: 'User ID error'});
        if (!ChannelArg) return interaction.reply({content: 'Channel ID error'});

        let User = interaction.guild.members.cache.get(UserArg);

        if (!User) return interaction.reply({content: 'User not exist'});

        if (ChannelArg == "0")
        {
            if (User.voice.channel)
            {
                User.voice.setChannel(null);
                return interaction.reply("User disconnected");
            };
            
            return interaction.reply("The user is not in a channel");
        };

        if (!User.voice.channel)
        {
            interaction.reply("The user is not in a channel.");

            const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('RD Sound')
            .setDescription('Please join <#' + ChannelArg + '>')
            .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
    
            return User.send({content: "", embeds: [embed], ephemeral: true});
        };

        User.voice.setChannel(ChannelArg);

        interaction.reply({content: 'User moved'});
    }
};