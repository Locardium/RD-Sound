const { EmbedBuilder } = require('discord.js');
const Config = require('../../Config.json');
const Functions = require('../others/functions');
const fs = require('fs');

module.exports = 
{
    Data: 
    {
        Name: "verify",
        Shortcuts: [],
        Description: "Verify user",
        DM: false,
        Inputs: [
            {type: 3, name: "code", id: 1, description: "Verification Code", required: true}
        ],
        Slash: true,
        OnlyBot: false
    },
    async Execute(client, interaction)
    {
        const codeArg = Functions.CheckArgs(interaction, this.Data.Inputs.filter(x => x.name == "code"));
        if (!codeArg) return interaction.reply({content: `Use \`${Config.bot.prefix}verify [CODE]\``, ephemeral: true});

        if (codeArg.toLowerCase() == "code")
        {
            const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('That is not a code, restart the game or contact an admin.')
            .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
    
            return interaction.reply({content: "", embeds: [embed], ephemeral: false});
        };

        const userId = Functions.GetUser(interaction).id

        const fileLocation = './db/roblox-users.json';
        const data = JSON.parse(fs.readFileSync(fileLocation, 'utf8'));
        let userData;
        for (x in data)
        {
            if (data[x].code.toLowerCase() == codeArg.toLowerCase())
            {
                userData = data[x];
                break;
            }
        }

        let userData2;
        for (x in data)
        {
            if (data[x].discordId == userId)
            {
                userData2 = data[x];
                break;
            }
        }

        if (userData2 && userData2.discordId == userId)
        {
            const embed = new EmbedBuilder()
            .setColor(0x1e90ff)
            .setTitle('Info')
            .setDescription('Your discord already verified.')
            .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
    
            return interaction.reply({content: "", embeds: [embed], ephemeral: false});
        }
        else if (userData && userData.code.toLowerCase() == codeArg.toLowerCase() && userData.discordId == userId)
        {
            const embed = new EmbedBuilder()
            .setColor(0x1e90ff)
            .setTitle('Info')
            .setDescription('You are already verified.')
            .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
    
            return interaction.reply({content: "", embeds: [embed], ephemeral: false});
        }
        else if (userData && userData.code.toLowerCase() == codeArg.toLowerCase() && userData.discordId == undefined)
        {
            userData.discordId = userId;

            fs.writeFile(fileLocation, JSON.stringify(data), (err) => { 
                if (err) 
                {
                    const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Error')
                    .setDescription('An error has occurred. Please try again or contact an admin.')
                    .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
            
                    interaction.reply({content: "", embeds: [embed], ephemeral: false});
                    
                    fs.unlink(dest);

                    return console.error(err);
                };

                const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('Success')
                .setDescription('We verified you correctly.')
                .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
        
                interaction.reply({content: "", embeds: [embed], ephemeral: false});
            });

            return;
        };

        const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Error')
        .setDescription('This code is already verified or does not exist.')
        .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});

        interaction.reply({content: "", embeds: [embed], ephemeral: false});
    }
};