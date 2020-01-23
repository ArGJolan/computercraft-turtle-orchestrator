# ComputerCraft Turtle Orchestrator

A web based ComputerCraft Turtle orchestrator.
Used for mining, but I'll possibly work on more advanced features soon.

## ComputerCraft wiki

[https://computercraft.info/](https://computercraft.info/)

## Motivations

I wanted to create a self replicating turtle that I need to setup once and it would go and mine / fork by itself with little to no maintenance.
I'm lazy and don't want to learn RedNet, so orchestrating them externally sounded like a good idea.

## Environment variable

- `APPCONFIG_SERVICE_DATABASE_USER` To override postgres user
- `APPCONFIG_SERVICE_DATABASE_PASSWORD` To override postgres password
- `APPCONFIG_SERVICE_DATABASE_HOST` To override postgres host
- `APPCONFIG_SERVICE_DATABASE_PORT` To override postgres port
- `APPCONFIG_SERVICE_DATABASE_DATABASE` To override postgres database
- `APPCONFIG_*` fill with whatever you feel like to override stuff in `config/config.js`

## Features to come

- Autonomous turtles (without orchestrator)
- Chunk loading with turtle (should be done with FTBUtilities / self placed chunk loaders / anchors for now)
