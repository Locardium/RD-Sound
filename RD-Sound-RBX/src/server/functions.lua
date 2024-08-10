local Functions = {}
local Settings

function Functions.init(setting)
	Settings = setting
end

local HttpService = game:GetService("HttpService")
local StarterPlayer = game:GetService("StarterPlayer")

local RemoteEvent = game:GetService("ReplicatedStorage"):WaitForChild("RDSound-RS").RemoteEvent

local userVerified = {}

local function tableToQuery(args)
	local query = ""
	for k,v in pairs(args) do
		if query ~= "" then
			query = query .. "&"
		end
		query = query .. k .. "=" .. tostring(v)
	end
	return query
end

function Functions.checkConnection()
	if (Settings.roblox.testing) then return true end
	
	local success, result = pcall(HttpService.GetAsync, HttpService, Settings.server.host)
	if (success) then return true end

	if result == "Http requests are not enabled. Enable via game settings" then
		error("Http requests are not enabled. Enable via game settings")
	elseif result == "HttpError: DnsResolve" then
		error("Invalid URL")
	elseif result == "HttpError: ConnectFail" then
		error("Fail to connect")
	else 
		error("Other error. Error: "..result)
	end
end

function Functions.sendData(option, args)
	local URL = string.format("%s%s?token=%s&option=%s&%s", Settings.server.host, "rdsound-sd", Settings.server.token, option, tableToQuery(args))
	local success, result = pcall(HttpService.GetAsync, HttpService, URL)
	
	if (not success) then
		warn(result)
	elseif (success) then
		local response = HttpService:JSONDecode(result)
		if (response.success == false and response.error ~= 4) then
			warn(response.message)
		end
	end
end

function Functions.getDB()
	local URL = string.format("%s%s?token=%s", Settings.server.host, "rdsound-db", Settings.server.token)
	local success, result = pcall(HttpService.GetAsync, HttpService, URL)

	if (not success) then
		warn(result)
	elseif (success) then
		local response = HttpService:JSONDecode(result)

		if (response.success == true) then
			return response.data
		elseif (response.success == false and response.error ~= 4) then
			warn(response.message)
		end
	end
	
	return {}
end

function Functions.checkUser(player)
	userVerified[player.UserId] = false

	local db = Functions.getDB()
	for k,v in pairs(db) do
		if k == tostring(player.UserId) then
			userVerified[player.UserId] = v
			return true
		end
	end

	return false
end

local timeout = {}
function Functions.isVerified(player, button)
	if (not Functions.checkUser(player)) then
		if timeout[player.UserId] and time() < timeout[player.UserId] then return else timeout[player.UserId] = time() + 3 end

		Functions.sendData("adduser", {robloxId = player.UserId})
		return Functions.isVerified(player, button)
	end

	local humanoid = player.Character.Humanoid

	if (not userVerified[player.UserId].discordId) then
		RemoteEvent:FireClient(player, "setCode", userVerified[player.UserId].code)

		humanoid.WalkSpeed = 0
		humanoid.JumpPower = 0
		
		if (button) then RemoteEvent:FireClient(player, "showInfo") end

		return
	end

	humanoid.WalkSpeed = StarterPlayer.CharacterWalkSpeed
	humanoid.JumpPower = StarterPlayer.CharacterJumpPower

	RemoteEvent:FireClient(player, "hideUI")
end

function Functions.skipVerify(player)
	if (Settings.roblox.forceVerify and not Settings.roblox.testing) then return end
	
	local humanoid = player.Character.Humanoid

	humanoid.WalkSpeed = StarterPlayer.CharacterWalkSpeed
	humanoid.JumpPower = StarterPlayer.CharacterJumpPower

	RemoteEvent:FireClient(player, "hideUI")
end

function Functions.getUser(player)
	return userVerified[player.UserId]
end

return Functions
