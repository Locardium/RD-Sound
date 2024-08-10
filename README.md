
# RD Sound
This is a code I used quite a while ago at a Roblox event. Since I no longer work at Roblox and I saw that several people were using my code without my consent, I decided to modify it a little so that it can be understood more and works as well as possible, in this way I leave it free of use and open to any modification.

What does this code do?? It allows you to have several areas on your Roblox map and so when the player changes areas using a Discord bot, the user changes the channel.

## How this work
First, the player receives a code that must be verified through Discord. Once the user is verified, the script sends a command to Discord when the user moves zones for the bot to move them to another channel.

## Installation
- Install [RZones](https://github.com/Locardium/RZones) in your game.

- Download the files in the [Release](https://github.com/locardium/RD-Sound/releases/tag/v2.0.0) section.
- Make sure you have "[NodeJS](https://nodejs.org/es)" installed on your computer.
- Open the `RD-Sound-Server` folder and run the `Install-package.bat` file.
- Open the `Config.json` file.
     - In the `admins` section in `commands -> permissions -> admins` add your Discord id.
     - In the `token` section in `"bot -> token` add the TOKEN of your Discord bot.
- Open the file `Start.bat`. (Make sure the bot has permissions to "View channels", "Manage channels", Manage webhooks", "Send messages")
- Run the `/setup` command on your server and copy the TOKEN that was sent to the DM or copy it from the "Config.json" file.
- Move the `RD-Sound.rbxm` file to your Roblox map.
- Open the `Settings` file in Roblox.
- Paste the TOKEN in the `token` section in `server -> token`.
- In case you host the bot or want to use the script outside of Roblox Studio, edit the `host` section in `server -> host`.
- Put zones name with discord channel id in `roblox -> zones`.

## Demo
https://streamable.com/cckhi0#

