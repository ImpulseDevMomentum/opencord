# Getting Started

## Installation

```bash
npm install
npm run build
```

## Getting Your User Token

⚠️ **WARNING**: This is against Discord ToS! Use at your own risk.

### Method 1: Browser DevTools

1. Open Discord in browser (discord.com/app)
2. Press F12 to open DevTools
3. Go to "Network" tab
4. Send any message or perform any action
5. Find a request to `discord.com/api`
6. In Headers, find `authorization`
7. Copy the value

### Method 2: Browser Console

1. Open Discord in browser
2. Press F12 → Console
3. Paste:
```javascript
(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
```
4. Copy the returned token

## First Connection

Create a file `test.ts`:

```typescript
import { Client } from './dist/index';

const client = new Client({
  token: 'YOUR_USER_TOKEN_HERE'
});

client.on('ready', (user) => {
  console.log(`✅ Connected as ${user.tag}`);
});

client.on('error', (error) => {
  console.error('❌ Error:', error);
});

client.login();
```

Run it:

```bash
npm run build
node dist/test.js
```

## Using TypeScript

OpenCord is written in TypeScript and has full type support:

```typescript
import { Client, Message, User, Intents } from './dist/index';

const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  intents: Intents.ALL
});

client.on('messageCreate', (message: Message) => {
  const author: User = message.author;
  console.log(author.tag);
});
```

## Next Steps

- Learn about [Messages](features/messages.md)
- Explore [API Reference](api/README.md)
- Check [Examples](examples.md)