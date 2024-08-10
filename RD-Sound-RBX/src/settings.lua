return {
	roblox = {
		testing = false, --Use this option if you are testing your game
		customCamera = true, --Use custom camera when verify menu is active
		forceVerify = false, --Force player to verify
		zones = { --Sets the discord channel id in zones. Use this format: ["ZONE_NAME"] = "CHANNEL_ID"
			["ZONE_NAME"] = "CHANNEL_ID",
		}
	},
	server = {
		token = "", --To get the token use the "setup" command and copy the token that was sent to the md or copy it from the bot config file
		host = "http://localhost/", --LocalHost only works in Roblox Studio and if you hosting the bot in your computer
		bot = {
			prefix = ".", --Bot prefix
			useSlash = true --If use slash commands
		},
		discordInvite = "discord.gg/" --Your discord invite
	}
}