const Config = require('../../Config.json');

module.exports.GetUser = (interaction) => {
    if (typeof interaction.author !== "undefined") return interaction.author;
    
    return interaction.user;
};

module.exports.CheckArgs = (interaction, arg) => {
    if (!interaction.options)
    {
        var args = interaction.content.slice(Config.bot.prefix.length).trim().split(' ');

        if (args[arg[0].id] == undefined) 
        {
            return false;
        };

        return args[arg[0].id];
    };

    if (interaction.options.get(arg[0].name))
    {
        return interaction.options.get(arg[0].name).value;
    };

    return false;
};