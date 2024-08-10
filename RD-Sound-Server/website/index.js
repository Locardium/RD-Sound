const express = require("express"),
router = express.Router();
const Config = require('../Config.json');
const fs = require('fs');
const keygen = require("keygenerator");

const client = require('../bot/index.js');
const { EmbedBuilder } = require('discord.js');

//Other
router.get("/", async(req, res) => {
	res.send("Web started")
});

//Get DB
router.get("/rdsound-db", async(req, res) => {
	if (!Config.roblox) return res.json({success: false, error: 1, message: "Bot not configured"});
	if (req.query.token != Config.roblox.token) return res.json({success: false, error: 2, message: "Invalid token"});
  	
	try {
		res.json({success: true, data: JSON.parse(fs.readFileSync('./db/roblox-users.json', 'utf8'))});
	} catch (error) {
		console.error(error);
		res.json({success: false, error: 500, message: "Server error"});
	}
});

//Send Data
router.get("/rdsound-sd", async(req, res) => {
	if (!Config.roblox) return res.json({success: false, error: 1, message: "Bot not configured"});

	try {
		const query = req.query;

		if (query.token != Config.roblox.token) return res.json({success: false, error: 2, message: "Invalid token"});
		if (!query.option) return res.json({success: false, message: "'option' not set"});
		
		if (query.option == "adduser")
		{
			if (!query.robloxId) return res.json({success: false, error: 3, message: "'robloxId' not set"});

			const fileLocation = './db/roblox-users.json';
			let data = JSON.parse(fs.readFileSync(fileLocation, 'utf8'));

			const userData = data[query.robloxId]
			if (userData) return res.json({success: false, message: "User already added"});

			data[query.robloxId] = {code: keygen._({length: 6, forceUppercase: true})};

			fs.writeFileSync(fileLocation, JSON.stringify(data));

			return res.json({success: true});
		}
		else if (query.option == "move")
		{
			if (!query.discordId) return res.json({success: false, error: 3, message: "'discordId' not set"});
			if (!query.channelId) return res.json({success: false, error: 3, message: "'channelId' not set"});

			const guild = await client.guilds.fetch(Config.roblox.guildId);
			if (!guild) return res.json({success: false, error: 11, message: "Bot bad configured, guild not exist"});

			if (query.channelId != "0")
			{
				const channel = await guild.channels.fetch(query.channelId);
				if (!channel) return res.json({success: false, error: 12, message: "Roblox bad configured, channel not exist"});
			}

			const user = await guild.members.fetch(query.discordId);
			if (!user) return res.json({success: false, error: 4, message: "User not exist"});

			if (!user.voice.channel)
			{
				res.json({success: false, error: 4, message: "The user is not in a channel"});

				if (query.channelId != "0" && Config.bot.alertIfNotInChannel)
				{
					const embed = new EmbedBuilder()
					.setColor(0x1e90ff)
					.setTitle('Info')
					.setDescription('Please join to the channel <#' + query.channelId + '>')
					.setFooter({iconURL: Config.bot.footerLogo, text: Config.bot.name});
			
					user.send({content: "", embeds: [embed], ephemeral: true});
				}

				return;
			}
			else if (query.channelId == "0")
			{
				return res.json({success: false, error: 4, message: "The user is not in a channel"});
			} 

			user.voice.setChannel(query.channelId);
			
			return res.json({success: true});
		}
		
		res.json({success: false, error: 500, message: "Server error"});
	} catch (error) {
		console.error(error);
		res.json({success: false, error: 500, message: "Server error"});
	}
});

module.exports = router;