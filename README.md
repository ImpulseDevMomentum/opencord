<div align="center">
	<br />
	<p>
		<img src="soon" width="500" height="500" alt="opencord"/>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/okazja"><img src="https://img.shields.io/discord/soon" alt="Discord server"/></a>
		<a href="https://www.npmjs.com/package/opencord"><img src="https://img.shields.io/npm/v/opencord" alt="npm version" /></a>
		<a href="https://impulsedevmomentum.github.io/opencord/"><img src="https://img.shields.io/badge/docs-latest-blue" alt="Documentation" /></a>
	</p>
</div>

# OpenCord

A powerful TypeScript library for interacting with Discord as a user.

## Installation

```bash
npm install opencord
```

```bash
yarn add opencord
```

```bash
pnpm add opencord
```

## Quick Start

```typescript
import { Client } from 'opencord';

const client = new Client({
    token: 'your_discord_token'
});

client.on('ready', (user) => {
    console.log(`Logged in as ${user.username}!`);
});

client.on('messageCreate', (message) => {
    if (message.content === '!ping') {
        message.reply('Pong!');
    }
});

client.login();
```

## Documentation

Visit our [documentation](https://impulsedevmomentum.github.io/opencord/) for complete API reference and examples.