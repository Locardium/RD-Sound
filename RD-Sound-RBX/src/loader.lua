local Settings = require(script.Parent.Parent.Settings)

local mainFolder = script.Parent.Parent
local scriptsFolder = script.Parent
local menuFolder = script.Parent.Parent.Menu

--Unique ID
local function generateId()
	local chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	local id = ""
	for i = 1, 6 do
		local randomIndex = math.random(1, #chars)
		id = id .. chars:sub(randomIndex, randomIndex)
	end
	return "Locos-"..id
end
local folderId = generateId()

mainFolder:SetAttribute("id", folderId)

--Cam
local customCam = menuFolder.CustomCam
customCam.Transparency = 1
customCam.CanCollide = false
customCam.CanTouch = false

--Replicated Storage
local rsFolder = scriptsFolder.Events
rsFolder.Parent = game.ReplicatedStorage
rsFolder.Name = "RDSound-RS"

--Lighting
local blur = menuFolder.Blur
blur.Name = "RDSound-Blur"
blur.Parent = game.Lighting

--Starter Gui
local sgFolder = Instance.new("Folder")
sgFolder.Parent = game.StarterGui
sgFolder.Name = "RDSound-SG"

menuFolder.VerifyMenu.Parent = sgFolder

--Starter Player Scripts
local spsFolder = scriptsFolder.Client
spsFolder.Parent = game.StarterPlayer.StarterPlayerScripts
spsFolder.Name = "RDSound-SPS"
spsFolder:SetAttribute("mfId", folderId)

--Server Script Service
local sssFolder = scriptsFolder.Server
sssFolder.Parent = game.ServerScriptService
sssFolder.Name = "RDSound-SSS"
sssFolder:SetAttribute("mfId", folderId)

--Set Zones
local zAPI = require(game.ReplicatedStorage:WaitForChild("RZones-RS").API)
for k,v in pairs(Settings.roblox.zones) do
	zAPI.setAttribute(k, "rdsound", "channelId", v)
end

task.wait()
script:Destroy()