const { EmbedBuilder } = require('discord.js');
const Config = require('../../Config.json');
const Functions = require('../others/functions');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

module.exports = 
{
    Data: 
    {
        Name: "setup",
        Shortcuts: ["s"],
        Description: "Setup bot",
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
            .setDescription('You do not have permissions to use this command.')
            .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
            return interaction.reply({content: "", embeds: [embed], ephemeral: true});
        };

        if (Config.roblox && Config.roblox.token && Config.roblox.guildId) {
            await interaction.reply({ content: 'Bot is already configured. Do you want to go ahead and overwrite it? Respond with y/n.', ephemeral: false });

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
        }

        Config.roblox = {token: uuidv4(), guildId: interaction.guildId};

        fs.writeFileSync('./Config.json', JSON.stringify(Config, null, "\t"));

        let dmMessage = await Functions.GetUser(interaction).send({content: `**TOKEN**: ||\`${Config.roblox.token}\`||. Message delete in 15 sec.`, ephemeral: false});

        let embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('Success')
        .setDescription(`Copy the \`TOKEN\` that was sent to the DM (<#${dmMessage.channelId}>) or from the configuration file and paste in roblox settings.`)
        .setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});

        let sendMessage = { embeds: [embed], ephemeral: false }

        if (!interaction.replied) 
        {
            await interaction.reply(sendMessage);
        }
        else
        {
            await interaction.followUp(sendMessage);
        }

        setTimeout(() => dmMessage.delete(), 15000);
    }
};