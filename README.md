# AliBot

> [!NOTE]
> This bot is no longer active. It was deployed as part of the [SkyAli](https://github.com/Alifarce/SkyAli) platform on AWS EC2. Kept public for reference.

> Discord bot for the SkyAli community platform with slash command admin interface for skyali.net, Hypixel Skyblock API integration, ticket system, and inter-service log relay.

[![JavaScript](https://img.shields.io/badge/language-JavaScript-f7df1e?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865f2?logo=discord&logoColor=white)](https://discord.js.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Overview

AliBot is the Discord bot companion to skyali.net, a directory of verified Hypixel Skyblock communities. Rather than building a dedicated admin panel for the site, all content management is handled through Discord slash commands: adding, removing, and updating server listings directly from Discord, with changes reflected on the website in real time via the backend REST API.

---

## Features

### Content Management: Admin interface for skyali.net

All commands are restricted to bot developers or server administrators.

| Command | Description |
|---|---|
| `/addserver` | Adds a Discord server to the directory (resolves invite, fetches metadata, posts to API) |
| `/removeserver` | Removes a server from the directory |
| `/updateserver` | Updates server metadata (re-fetches from Discord API) |
| `/checkserver` | Checks whether a server is listed and retrieves its current data |
| `/getservers` | Lists all servers currently in the directory |
| `/addlanguage` / `/removelanguage` | Manage Twitch stream language filters shown on the site |
| `/addbanned` / `/removebanned` / `/getbanned` | Manage a banned server/word list |

### Hypixel Skyblock — `/mayor`

Fetches the current Skyblock mayor and ongoing election from the Hypixel API. Displays mayor perks in a Discord embed with two interactive buttons:

- Current election chart: renders a vote share bar chart for all active candidates
- Last election chart: same for the previous election

Charts are generated server-side as PNG images using chart.js + node-canvas (via quickchart-js), attached directly to the button response.

### Ticket System

Three ticket types: `support`, `report`, `discord-server`.

Each ticket creates a private text channel with per-user Discord permission overwrites (everyone denied, user and staff allowed). Full lifecycle:

1. User creates ticket → private channel opens with action buttons
2. Staff can lock the channel (revokes user send permission)
3. Staff deletes the ticket via a confirmation modal
4. All actions are logged to a dedicated audit channel

### Inter-service Log Relay

AliBot exposes a lightweight Express HTTP server on port 3000. The SkyAli backend calls `POST /log` to forward structured log messages (info / warn / error / fatal) to a Discord channel — routing backend observability through the bot rather than a dedicated logging service.

```
SkyAli Backend ─► POST /log ─► AliBot Express ─► #logs Discord channel
```

---

## Architecture

Commands, buttons, and modals are loaded dynamically at startup by scanning the `src/commands/`, `src/buttons/`, and `src/modals/` directories.

```
AliBot/
└── src/
    ├── index.js                    # Bot init, Express log server
    ├── handlers/
    │   └── eventHandler.js         # Dynamic event loader
    ├── events/
    │   ├── ready/
    │   │   ├── registerCommands.js # Auto-registers slash commands on startup
    │   │   └── ticketChannelMessage.js
    │   └── interactionCreate/
    │       ├── handleCommands.js
    │       ├── handleButtons.js
    │       └── handleModals.js
    ├── commands/
    │   ├── hypixelapi/             # /mayor, /status
    │   └── skyali/
    │       ├── discordList/        # Server CRUD commands
    │       ├── twitchLanguages/    # Language filter commands
    │       ├── bannedWords/        # Ban list commands
    │       └── ticket.js
    ├── buttons/
    │   ├── mayorButtons/           # Election chart generation
    │   └── ticketChannel/         # Ticket lifecycle buttons
    ├── modals/
    │   └── ticketChannel/         # Ticket creation forms
    └── utils/
        ├── logger.js               # Structured Discord channel logger
        ├── fetchApi.js
        └── ...
```

---

## Dependencies

| Package | Role |
|---|---|
| `discord.js` v14 | Discord bot framework |
| `express` | HTTP log relay endpoint |
| `axios` | HTTP calls to SkyAli backend API |
| `quickchart-js` + `canvas` | Server-side chart rendering (election charts) |
| `dotenv` | Environment variable management |

---

## Environment Variables

```env
BOT_TOKEN=          # Discord bot token
HYPIXEL_API=        # Hypixel API key
MONGO_URI=          # MongoDB connection string (shared with SkyAli backend)
```

This bot is part of the [SkyAli](https://github.com/Alifarce/SkyAli) project and is designed to run as a Docker service within its Compose stack.