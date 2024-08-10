local Players = game:GetService("Players")
local Lighting = game:GetService("Lighting")
local TweenService = game:GetService("TweenService")
local RemoteEvent = game:GetService("ReplicatedStorage"):WaitForChild("RDSound-RS").RemoteEvent

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
local blur = Lighting:WaitForChild("RDSound-Blur")

local userCamera = workspace.CurrentCamera
local customCam = rdFolder.Menu:WaitForChild("CustomCam")

local setCam = true
local buttonPressed = false

local menu = Players.LocalPlayer.PlayerGui:WaitForChild("RDSound-SG").VerifyMenu

--Remote event
RemoteEvent.OnClientEvent:Connect(function(option, ...)
	if (option == "setCode") then
		local code = ...
		local menuIntances = menu:GetDescendants()
		for i = 1, #menuIntances do
			local ins = menuIntances[i]
			if (ins:IsA("TextLabel")) then
				if (ins.Text:match("%[CODE%]")) then
					ins.Text = ins.Text:gsub("%[CODE%]", code)
				end
			end
		end
	elseif (option == "hideUI") then
		--Hide menu
		setCam = false
		menu.Enabled = false

		if (Settings.roblox.testing) then blur.Enabled = false return end
		
		--Hide blur
		local blurTween = TweenService:Create(blur, TweenInfo.new(1), {Size = 0})

		--Set camera custom to player 
		if Settings.roblox.customCamera then
			repeat task.wait() until Players.LocalPlayer.Character
			
			local position = Players.LocalPlayer.Character:WaitForChild("Head").CFrame * CFrame.new(0, 3.5, 12) * CFrame.Angles(-0.3, 0, 0)

			if (buttonPressed) then
				local tween = TweenService:Create(userCamera, TweenInfo.new(1), { CFrame = position })

				blurTween:Play()
				tween:Play()

				tween.Completed:Wait()
			else
				userCamera.CFrame = position
			end

			blur.Enabled = false
			userCamera.CameraSubject = Players.LocalPlayer.Character.Humanoid
			userCamera.CameraType = Enum.CameraType.Custom
		elseif (buttonPressed) then
			blurTween:Play()
			blurTween.Completed:Wait()
		end
		
		blur.Enabled = false
	elseif (option == "showInfo") then
		local menuIntances = menu:GetDescendants()
		for i = 1, #menuIntances do
			local ins = menuIntances[i]
			if (ins:IsA("TextLabel") and ins.Name == "Info") then
				ins.Visible = true
				task.wait(3)
				ins.Visible = false
				break
			end
		end
	end
end)

--Menu Button
local menuIntances = menu:GetDescendants()
for i = 1, #menuIntances do
	local ins = menuIntances[i]
	if (ins:IsA("TextButton") and ins.Name:lower() == "success") then
		ins.MouseButton1Click:Connect(function()
			buttonPressed = true
			RemoteEvent:FireServer("success")
		end)
	elseif (ins:IsA("TextButton") and ins.Name:lower() == "skip") then
		if (Settings.roblox.forceVerify) then
			ins.Visible = false
		else
			ins.MouseButton1Click:Connect(function()
				buttonPressed = true
				RemoteEvent:FireServer("skip")
			end)
		end
	elseif (ins:IsA("TextLabel") and ins.Text:match("%[DISCORD%]")) then
		ins.Text = ins.Text:gsub("%[DISCORD%]", Settings.server.discordInvite)
	elseif (ins:IsA("TextLabel") and ins.Text:match("%[PREFIX%]")) then
		local prefix = Settings.server.bot.prefix
		if (Settings.server.bot.useSlash) then prefix = "/" end
		ins.Text = ins.Text:gsub("%[PREFIX%]", prefix)
	elseif (ins:IsA("TextLabel") and ins.Name:lower() == "info") then
		ins.Visible = false
	end
end

--Set custom camera
if (Settings.roblox.customCamera and not Settings.roblox.testing) then
	repeat
		userCamera.CameraType = Enum.CameraType.Scriptable
		userCamera.CameraSubject = customCam
		userCamera.CFrame = customCam.CFrame
		task.wait()
	until (userCamera.CameraType == "Scriptable" and userCamera.CameraSubject == customCam and userCamera.CFrame == customCam.CFrame) or (not setCam)
end
