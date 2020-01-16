--================ NOTE ================--
-- THESE VARIABLES CAN BE EDITED SAFELY --
--======================================--
-- https://discordapp.com/api/webhooks/xxxx/yyyyy
discordWebHookUrl = ""
-- https://computercraft-turtle-orchestrator.yourdomain.ltd/
orchestratorUrl = ""

--===================== NOTE ======================--
-- THESE VARIABLES CAN BE EDITED AT YOUR OWN RISKS --
--=================================================--
outputChestFile = "outputChest"
outputChestPosition = 16
fuelChestFile = "fuelChest"
fuelChestPosition = 15
dropErrorSleepTime = 300

--======= NOTE ======--
-- START OF THE CODE --
--===================--

--===== SECTION =====--
--     INVENTORY     --
--===================--
-- Set output chest as being placed down (file $fuelChestFile exists) and place it down
function placeOutputChest()
  outputChestFd = fs.open(outputChestFile, "w")
  outputChestFd.write('1')
  outputChestFd.close()
  turtle.select(outputChestPosition)
  turtle.placeUp()
  turtle.select(1)
end

-- Pick up output chest and set it as not being placed (file $fuelChestFile doesn't exists)
function pickupOutputChest()
  turtle.select(outputChestPosition)
  turtle.digUp()
  turtle.select(1)
  fs.delete(outputChestFile)
end

-- Tell if output chest is placed down
function isOutputChestPlaced()
  return fs.exists(outputChestFile)
end

-- Send a request to a Discord webhook
function sendDiscordWebHook(alertString)
  http.post(discordWebHookUrl, "content="..alertString)
-- TODO handle errors
end

-- Send alert to enabled services
function sendAlerts(alertString)
  if not discordWebHookUrl == "" then
    sendDiscordWebHook(alertString)
  end
end

-- Wait until drop has been processed, send an alert if drop didn't happen
function safeDropUpItem(slot)
  shouldStop = false
  turtle.select(slot)
  while shouldStop == false do
    shouldStop = turtle.dropUp()
    if shouldStop == false then
      sendAlerts("Output chest is full")
      os.sleep(dropErrorSleepTime)
    end
  end
end

-- Empty all items in inventory except output and fuel chests
function emptyInventoryUp()
  placeOutputChest()
  for slot=1,16 do
    if not slot == outputChestPosition and not slot == fuelChestPosition then
      safeDropUpItem(slot)
    end
  end
end

--===== SECTION =====--
--     MOVEMENTS     --
--===================--

--===== SECTION =====--
--      MINING       --
--===================--
