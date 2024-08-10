const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require('../Config.json');
let fs = require('fs');
const { GetUser } = require("./others/functions");

const client = new Discord.Client(
    { 
        intents: 
        [
            Discord.GatewayIntentBits.Guilds, 
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.DirectMessages,
            Discord.GatewayIntentBits.MessageContent,  
            Discord.GatewayIntentBits.GuildVoiceStates,
            Discord.GatewayIntentBits.GuildWebhooks,
        ],
        partials:
        [
            Discord.Partials.User,
            Discord.Partials.Channel,
            Discord.Partials.Message,
            Discord.Partials.GuildMember
        ]
    }
);

client.on("ready", () => {
    console.log(`Bot started. Account: ${client.user.tag}`);
});

// 1	Sub Command
// 2	Sub Command Group
// 3	String
// 4	Integer
// 5	Boolean
// 6	User
// 7	Channel
// 8	Role
// 9	Mentionable
// 10	Number
// 11	Attachment

//Command Loader
let commands = [];

client.commands = new Discord.Collection();
const CommandsFiles = fs.readdirSync('./bot/commands/').filter(file => file.endsWith('.js'));
for (const file of CommandsFiles) 
{
    const Command = require(`./commands/${file}`);

    client.commands.set(Command.Data.Name, Command);

    if (typeof Command.onStart === "function") { 
        Command.onStart(client);
    }

    if (Command.Data.Slash )
    {
        commands.push({
            name: Command.Data.Name,
            description: Command.Data.Description,
            options: Command.Data.Inputs,
            dm_permission: Command.Data.DM,
            // default_member_permissions: globalUse[Command.Data.Name] ? undefined : false,
            // permissions: Permissions
        });
    }
}

//Execute commands without slash
client.on('messageCreate', async message => 
{
    if (!message.content.startsWith(`${config.bot.prefix}`)) return;
    
    for (const Command of client.commands) 
    {
        const CommandExecuted = message.content.split(' ')[0].replace(config.bot.prefix, '')
        
        if (Command[1].Data.Name == CommandExecuted || Command[1].Data.Shortcuts.includes(CommandExecuted))
        {
            if (!Command[1].Data.DM && message.channel.type == Discord.ChannelType.DM) return;
            if (Command[1].Data.OnlyBot && !message.author.bot) return;

            ExecuteCommand(message, Command[1], CommandExecuted);

            break;
        }
    }

});

//Execute commands with slash
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
    
	const Command = client.commands.get(interaction.commandName);
	if (!Command) return;

    ExecuteCommand(interaction, Command, interaction.commandName);
});

async function ExecuteCommand(interaction, Command, CommandExecuted)
{
    let canUse = false

    if (typeof Command.Data.Perms == "undefined" || !Command.Data.Perms.length) canUse = true;
    if (config.commands.permisions.admins.includes(GetUser(interaction).id)) canUse = true;

    if (!canUse)
    {
        for (let perms of Command.Data.Perms)
        {
            for (let x of perms)
            {
                if (x == GetUser(interaction))
                {
                    canUse = true
                    break
                }
            }
            
        }
    }
    
    if (!canUse)
    {
        const embed = new Discord.EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Error')
        .setDescription('You do not have permissions to use this command')
        .setFooter({iconURL: config.bot.footerLogo, text: 'Secrets Files'});

        return interaction.reply({embeds: [embed]});
    };

    try 
    {
        await Command.Execute(client, interaction);
    } 
    catch (error) 
    {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}

const rest = new REST({ version: "9" }).setToken(config.bot.token);
client.once("ready", () => 
{
    (async () => 
    {
        try 
        {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: await commands,
            });

            console.log(config.bot.prefix + "Successfully reloaded application [/] commands.");
        } 
        catch (err) 
        { 
            console.log(err)
        };
    })();
});

client.login(config.bot.token);

module.exports = client;