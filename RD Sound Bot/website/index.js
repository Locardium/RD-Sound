const express = require("express"),
router = express.Router();
const Config = require('../Config.json');
const { WebhookClient } = require('discord.js');
const fs = require('fs');

//Other
router.get("/", async(req, res) => {
	res.send("Web started")
});

//Get DB
router.get("/rdsound-db", async(req, res) => {
	res.header("Content-Type",'application/json');
  	res.send(fs.readFileSync("./DB/Roblox-Users-DB.json", 'utf8'));
});

//Send Webhook
router.get("/rdsound-sw", async(req, res) => {
	if (!Config.webhook) return;
	if (!req.query.message) return res.send("Not message seted");
	if (req.query.token != Config.webhook.token) return res.send("Invalid token");

	try 
	{
		const webhookClient = new WebhookClient({ id: Config.webhook.id, token: Config.webhook.token });
		await webhookClient.send({
			content: req.query.message,
			username: 'RD Sound',
			avatarURL: Config.bot.footerLogo,
		});

		res.send("Success");
	} 
	catch(err)
	{
		console.log(err)
		res.send("Error");
	}
});

module.exports = router;