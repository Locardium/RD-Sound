local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local zAPI = require(game.ReplicatedStorage:WaitForChild("RZones-RS").API)

local function getMainFolder()
	local mfId = script.Parent:GetAttribute("mfId")
	if (mfId == nil) then
		local timer = time()+5
		repeat 
			mfId = script.Parent:GetAttribute("mfId")

			if time() > timer then
				error("Main folder id not found")
			end
			task.wait()
		until (mfId ~= nil)
	end

	local ws = workspace:GetDescendants()
	for i = 1, #ws do
		local instance = ws[i]
		if instance:GetAttribute("id") == mfId then
			return instance
		end
	end

	return nil
end
local rdFolder = getMainFolder()

local Settings = require(rdFolder.Settings)
local Functions = require(script.Parent.Functions)

--Init funcs
Functions.init(Settings)

--Check connection
Functions.checkConnection()

--Players
local currentPlayers = {}
local function newPlayers(player)
	if (Settings.roblox.testing) then
		Functions.skipVerify(player)
		return
	end
	
	Functions.isVerified(player)

	zAPI.getCurrentZoneChanged(player, function(value)
		local playerData = Functions.getUser(player)

		if (playerData and playerData.discordId) then
			local channelId = zAPI.getAttribute(value, "rdsound", "channelId")
			if (channelId == false) then error("'channelId' not found") end

			Functions.sendData("move", {discordId = playerData.discordId, channelId = channelId})
		end
	end)
end

--Check current players
local players = Players:GetPlayers()
for i = 1, #players do
	local player = players[i]
	currentPlayers[player.UserId] = player
	
	task.spawn(function()
		player.CharacterAdded:Wait()
		newPlayers(player) 
	end)
end

--Check new players
Players.PlayerAdded:Connect(function(player)
	if (currentPlayers[player.UserId]) then return end
	player.CharacterAdded:Wait()
	newPlayers(player) 
end)

--Kick on leave
Players.PlayerRemoving:Connect(function(player)
	local playerData = Functions.getUser(player)
	if ((playerData and playerData.discordId) and not Settings.roblox.testing) then
		Functions.sendData("move", {discordId = playerData.discordId, channelId = "0"})
	end
end)

--Button Callback
local timeout = {}
ReplicatedStorage:WaitForChild("RDSound-RS").RemoteEvent.OnServerEvent:Connect(function(player, option)
	if (Settings.roblox.testing) then return end
	
	if (option == "success") then
		if timeout[player.UserId] and time() < timeout[player.UserId] then return else timeout[player.UserId] = time() + 3 end
		Functions.isVerified(player, true)
	elseif (option == "skip") then
		Functions.skipVerify(player)
	end	
end)