const Functions = require('../others/functions');
const keygen = require("keygenerator");
const fs = require('fs');

module.exports = 
{
    Data: 
    {
        Name: "adduser",
        Shortcuts: [],
        Description: "Add roblox user to DB",
        DM: false,
        Inputs: [
            {type: 3, name: "user", id: 1, description: "Roblox ID", required: true}
        ],
        Slash: false,
        OnlyBot: true
    },
    async Execute(client, interaction)
    {
        let UserArg = Functions.CheckArgs(interaction, this.Data.Inputs.filter(x => x.name == "user"));

        if (!UserArg) return interaction.reply({content: 'User ID error'});
        
        const FileLocation = './DB/Roblox-Users-DB.json';

        let data = JSON.parse(fs.readFileSync(FileLocation, 'utf8'));

        for (let x in data)
        {
            if (x == UserArg) return interaction.reply("User already added");
        };

        data[UserArg] = {Code: keygen._({length: 6}), DiscordId: "NULL"};

        fs.writeFileSync(FileLocation, JSON.stringify(data));

        interaction.reply({content: 'User added'});
    }
};