# Examples

Complete examples for common use cases.

## Basic Connection

```typescript
import { Client } from 'opencord';

const client = new Client({
  token: 'YOUR_USER_TOKEN'
});

client.login();
```

## Send Messages

```typescript
client.on('ready', async () => {
  const channel = await client.fetchChannel('CHANNEL_ID');
  await channel.send('Hello, World!');
});
```

## Auto-Responder

```typescript
client.on('messageCreate', async (message) => {
  if (message.author.id === client.user?.id) return;
  
  if (message.content.toLowerCase().includes('hello')) {
    await message.reply('Hi there! 👋');
  }
});
```

## Message Editing

```typescript
const message = await channel.send('Original message');
await message.edit('Edited message');
await new Promise(resolve => setTimeout(resolve, 5000));
await message.delete();
```

## Reactions

```typescript
const message = await channel.send('React to this!');

await message.react('👍');
await message.react('❤️');
await message.react('😂');

const users = await message.getReactions('👍');
console.log(`${users.length} users reacted with 👍`);

await message.unreact('👍');
```

## Forward Messages

```typescript
await message.forward('TARGET_CHANNEL_ID');

const user = await client.fetchUser('USER_ID');
await message.forward(user);
```

## Pin Messages

```typescript
await message.pin();
await new Promise(resolve => setTimeout(resolve, 2000));
await message.unpin();
```

## Typing Indicator

```typescript
await channel.startTyping();
await new Promise(resolve => setTimeout(resolve, 2000));
await channel.send('Done typing!');
```

## User Profiles

```typescript
const user = await client.fetchUser('USER_ID');
await user.fetchProfile('GUILD_ID'); // Optional guild context

console.log(user.bio);
console.log(user.legacyUsername);
console.log(user.badges);

if (user.guildMember) {
  console.log(`Roles: ${user.guildMember.roles.length}`);
  console.log(`Joined: ${user.guildMember.joined_at}`);
}
```

## Guild Info

```typescript
const guild = await client.fetchGuild('GUILD_ID');

console.log(`Name: ${guild.name}`);
console.log(`Members: ${guild.memberCount}`);
console.log(`Boost Level: ${guild.boostLevel}`);
console.log(`Total Boosts: ${guild.totalBoosts}`);
console.log(`Verified: ${guild.isVerified}`);
console.log(`Partnered: ${guild.isPartnered}`);
```

## Boost Server

```typescript
try {
  await guild.addBoost(2);
  console.log('Boosted server!');
} catch (error) {
  if (error instanceof NitroRequiredError) {
    console.log('Need Nitro to boost');
  }
}
```

## Error Handling

```typescript
import { 
  InvalidTokenError, 
  EmptyTokenError, 
  BotTokenError 
} from 'opencord';

try {
  const client = new Client({ token: '' });
} catch (error) {
  if (error instanceof EmptyTokenError) {
    console.error('Token is empty!');
  } else if (error instanceof BotTokenError) {
    console.error('Use user token, not bot token!');
  }
}

client.login().catch(error => {
  if (error instanceof InvalidTokenError) {
    console.error('Invalid token!');
  }
});
```

## Simple Connection

```typescript
import { Client } from 'opencord';

const client = new Client({
  token: 'YOUR_USER_TOKEN'
});

client.login();
```

## Message Logger

```typescript
import fs from 'fs';

client.on('messageCreate', (message) => {
  const log = `[${message.date}] ${message.author.tag}: ${message.content}\n`;
  fs.appendFileSync('messages.log', log);
});
```

## Auto-React Keywords

```typescript
const keywords = {
  'react': '✅',
  'love': '❤️',
  'funny': '😂',
  'cool': '😎'
};

client.on('messageCreate', async (message) => {
  for (const [keyword, emoji] of Object.entries(keywords)) {
    if (message.content.toLowerCase().includes(keyword)) {
      await message.react(emoji);
    }
  }
});
```