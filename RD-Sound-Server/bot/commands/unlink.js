const { EmbedBuilder } = require('discord.js');
const Config = require('../../Config.json');
const Functions = require('../others/functions');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

module.exports = 
{
    Data: 
    {
        Name: "unlink",
        Shortcuts: ["ul"],
        Description: "Unlink user",
        DM: false,
        Inputs: [
            {type: 3, name: "id", id: 1, description: "Put user Discord Id or Roblox Id", required: false}
        ],
        Slash: true,
        OnlyBot: false
    },
    async Execute(client, interaction)
    {
        const codeArg = Functions.CheckArgs(interaction, this.Data.Inputs.filter(x => x.name == "id"));

        if (codeArg && !Config.commands.permisions.admins.includes(Functions.GetUser(interaction).id))
        {
            let embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('You do not have permissions to use this command option.')
            .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
            return interaction.reply({content: "", embeds: [embed], ephemeral: true});
        };

        const userId = codeArg || Functions.GetUser(interaction).id

        const fileLocation = './db/roblox-users.json';
        const data = JSON.parse(fs.readFileSync(fileLocation, 'utf8'));
        let userData = data[userId];
        if (!data[userId])
        {
            for (x in data)
            {
                if (data[x].discordId == userId)
                {
                    userData = data[x];
                    break;
                }
            }
        }
        
        if (!userData) {
            const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('Account not found.')
            .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
    
             return interaction.reply({content: "", embeds: [embed], ephemeral: false});
        }
        else if (!userData.discordId) {
            const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('Account not linked.')
            .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
    
            return interaction.reply({content: "", embeds: [embed], ephemeral: false});
        }

        await interaction.reply({ content: `Do you want to unlink this account <@${userData.discordId}>? y/n.`, ephemeral: false });

        const filter = response => {
            return response.author.id === interaction.user.id && ['y', 'n'].includes(response.content.toLowerCase());
        };

        try {
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });
            const response = collected.first().content.toLowerCase();

            if (response === 'n') {
                await interaction.followUp({ content: 'Operation cancelled.', ephemeral: false });
                return;
            }
        } catch (error) {
            await interaction.followUp({ content: 'Operation cancelled.', ephemeral: false });
            return;
        }

        userData.discordId = undefined;

        try {
            fs.writeFileSync(fileLocation, JSON.stringify(data));

            const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('Success')
            .setDescription(`Unlinked account.`)
            .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});

            await interaction.followUp({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(err);

            const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('An error has occurred. Please try again or contact an admin.')
            .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
    
            interaction.reply({content: "", embeds: [embed], ephemeral: false});
        }
    }
};