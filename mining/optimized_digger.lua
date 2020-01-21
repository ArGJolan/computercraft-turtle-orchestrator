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
outputChestPosition = 16
refuelChestPosition = 15
dropErrorSleepTime = 300

--================ NOTE ================--
-- THESE VARIABLES SHOULD NOT BE EDITED --
--======================================--
status = ""
outputChestFile = "outputChest"
refuelChestFile = "refuelChest"
statusFile = "status"
remainingForwardMovesFile = "remainingForwardMoves"
initFile = "init"
deepnessFile = "deepness"

--======== NOTE =======--
-- METHODS DECLARATION --
--=====================--

--===== SECTION =====--
--        WEB        --
--===================--
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

--===== SECTION =====--
--     INVENTORY     --
--===================--
-- Return true if inventory is full, false if not
function isFull()
  for slot=1,16 do
    if turtle.getItemCount(slot) == 0 then
      return false
    end
  end
  return true
end

-- Set output chest as being placed down (file $outputChestFile exists) and place it down
function placeOutputChest()
  outputChestFd = fs.open(outputChestFile, "w")
  outputChestFd.write('1')
  outputChestFd.close()
  turtle.select(outputChestPosition)
  turtle.placeUp()
  turtle.select(1)
end

-- Pick up output chest and set it as not being placed (file $outputChestFile doesn't exists)
function pickOutputChest()
  turtle.select(outputChestPosition)
  turtle.digUp()
  turtle.select(1)
  fs.delete(outputChestFile)
end

-- Set refuel chest as being placed down (file $refuelChestFile exists) and place it down
function placeRefuelChest()
  refuelChestFd = fs.open(refuelChestFile, "w")
  refuelChestFd.write('1')
  refuelChestFd.close()
  turtle.select(refuelChestPosition)
  turtle.placeUp()
  turtle.select(1)
end

-- Pick up refuel chest and set it as not being placed (file $refuelChestFile doesn't exists)
function pickRefuelChest()
  turtle.select(refuelChestPosition)
  turtle.digUp()
  turtle.select(1)
  fs.delete(refuelChestFile)
end

-- Tell if output chest is placed down
function isOutputChestPlaced()
  return fs.exists(outputChestFile)
end

-- Wait until drop has been processed, send an alert if drop didn't happen
function safeDropUpItem(slot)
  local shouldStop = false
  turtle.select(slot)
  while shouldStop == false do
    shouldStop = turtle.dropUp()
    if shouldStop == false then
      sendAlerts("Output chest is full")
      os.sleep(dropErrorSleepTime)
    end
  end
end

-- If inventory is full, will empty it
function emptyInventoryIfFull()
  if isFull() then
    emptyInventoryUp()
  end
end

-- Drops the output chest up, empty all items in inventory except fuel chest, and pick the chest back up
function emptyInventoryUp()
  placeOutputChest()
  for slot=1,16 do
    if not slot == outputChestPosition and not slot == fuelChestPosition then
      safeDropUpItem(slot)
    end
  end
  setStatus("dig")
end

--===== SECTION =====--
--     MOVEMENTS     --
--===================--
-- Move forward after digging
function safeForward()
  while not turtle.forward() do
    turtle.dig()
  end
end

-- Go to next hole
function nextHole()
  -- TODO
  if not fs.exists(remainingForwardMovesFile) then
    local remainingForwardMovesFileFd = fs.open(remainingForwardMovesFile, "w")
    remainingForwardMovesFileFd.write("3")
    remainingForwardMovesFileFd.close()
  end
  local remainingForwardMovesFileFd = fs.open(remainingForwardMovesFile)
  local remainingForwardMoves = tonumber(remainingForwardMovesFileFd.readLine()) - 1
  remainingForwardMovesFileFd.close()

  remainingForwardMovesFileFd = fs.open(remainingForwardMovesFile, "w")
  remainingForwardMovesFileFd.write(tostring(remainingForwardMoves))
  remainingForwardMovesFileFd.close()

  safeForward()

  if remainingForwardMoves <= 0 then
    setStatus("dig")
  end
end

-- Goes back to the surface, check for fuel level, and refuel if needed
function surface()
  -- TODO
end

--===== SECTION =====--
--      MINING       --
--===================--
-- Dig down until bedrock, check if side blocks should be mined
function dig()
  -- TODO
end

--===== SECTION =====--
--      GENERAL      --
--===================--
function handleError()
  print("Something wrong happened, status="..status)
  sendAlerts("Something wrong happened, status="..status)
  sleep(60)
end

-- Update program
function update()

end

-- Update program and init everything
function init()
  update()
  if not fs.exists(initFile) then
    -- TODO Init goes here
    initFileFd = fs.open(initFile, "w")
    initFileFs.write("1")
    initFileFd.close()
  end
end

-- Drops the fuel chest up, get fuel from it, refuel and pick it back up
function refuel()
  placeRefuelChest()
  turtle.select(1)
  local suckUpResult = turtle.suckUp()
  if suckUpResult == false then
    print("Could not pick fuel in chest")
    sendAlerts("Could not pick fuel in chest")
  end
  local refuelResult = turtle.refuel()
  if refuelResult == false then
    print("Could not refuel")
    sendAlerts("Could not refuel")
  end
  pickRefuelChest()
  setStatus("nextHole")
end

-- Set current turtle status
function setStatus(statusToSet)
  local statusFd = fs.open(statusFile, "w")
  statusFd.write(statusToSet)
  statusFd.close()
  status = statusToSet
  return statusToSet
end

-- Get current turtle status
function getStatus()
  if not status == "" then
    return status
  end
  local statusFd = fs.open(statusFile)
  local status = statusFd.readLine()
  statusFd.close()
  return status
end

-- Dirty but should work and handle crashes pretty well
function mainLoop()
  status = getStatus()
  if status == "dig" then
    dig()
  elseif status == "surface" then
    surface()
  elseif status == "refuel" then
    refuel()
  elseif status == "nextHole" then
    nextHole()
  elseif status == "emptyInventoryUp" then
    emptyInventoryUp()
  elseif status == "waitForOrchestrator" then
    waitForOrchestrator()
  else
    handleError()
  end
end

--======== NOTE =======--
--         MAIN        --
--=====================--
init()
while true do
  mainLoop()
end
