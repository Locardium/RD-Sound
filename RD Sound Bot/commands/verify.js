const { EmbedBuilder } = require('discord.js');
const Config = require('../Config.json');
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
        let CodeArg = Functions.CheckArgs(interaction, this.Data.Inputs.filter(x => x.name == "code"));

        if (!CodeArg) return interaction.reply({content: `Use \`${Config.bot.prefix}verify [CODE]\``, ephemeral: true});

        if (CodeArg.toLowerCase() == "code")
        {
            const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('RD Sound')
            .setDescription('That is not a code, restart the game or contact an admin')
            .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
    
            return interaction.reply({content: "", embeds: [embed], ephemeral: false});
        };

        const FileLocation = './DB/Roblox-Users-DB.json';

        let data = JSON.parse(fs.readFileSync(FileLocation, 'utf8'));

        for (let x in data)
        {
            if (data[x].DiscordId == Functions.GetUser(interaction).id)
            {
                const embed = new EmbedBuilder()
                .setColor(0x1e90ff)
                .setTitle('Info')
                .setDescription('Your discord already verified')
                .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
        
                return interaction.reply({content: "", embeds: [embed], ephemeral: false});
            };
        };

        for (let x in data)
        {
            if (data[x].Code == CodeArg && data[x].DiscordId == Functions.GetUser(interaction).id)
            {
                const embed = new EmbedBuilder()
                .setColor(0x1e90ff)
                .setTitle('Info')
                .setDescription('You are already verified')
                .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
        
                return interaction.reply({content: "", embeds: [embed], ephemeral: false});
            };

            if (data[x].Code == CodeArg && data[x].DiscordId == "NULL")
            {
                data[x].DiscordId = Functions.GetUser(interaction).id;

                fs.writeFile(FileLocation, JSON.stringify(data), (err) => { 
                    if (err) 
                    {
                        const embed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('Error')
                        .setDescription('An error has occurred. Please try again or contact an admin')
                        .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
                
                        interaction.reply({content: "", embeds: [embed], ephemeral: false});
                        
                        fs.unlink(dest);

                        return console.log(err);
                    };

                    const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('Success')
                    .setDescription('We verified you correctly')
                    .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});
            
                    interaction.reply({content: "", embeds: [embed], ephemeral: false});
                }); 

                return;
            };
        };

        const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Error')
        .setDescription('This Code is already verified or does not exist')
        .setFooter({iconURL: Config.bot.footerLogo, text: 'RD Sound'});

        interaction.reply({content: "", embeds: [embed], ephemeral: false});
    }
};