# Message

Represents a Discord message.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Message ID |
| `channelId` | `string` | Channel ID |
| `guildId` | `string?` | Guild ID (if from a guild) |
| `author` | `User` | Message author |
| `content` | `string` | Message content |
| `timestamp` | `Date` | When message was sent |
| `editedTimestamp` | `Date?` | When message was edited |
| `mentions` | `User[]` | Mentioned users |
| `attachments` | `any[]` | Attachments |
| `embeds` | `any[]` | Embeds |

## Getters

### `time`

Formatted time string (locale-based).

```typescript
console.log(message.time); // "14:30:45"
```

### `date`

Formatted date and time string (PL locale).

```typescript
console.log(message.date); // "19.10.2025, 14:30:45"
```

## Methods

### `reply(content)`

Reply to the message.

```typescript
await message.reply('This is a reply');
```

**Parameters:**
- `content` - Message content (string)

**Returns:** `Promise<Message>`

### `edit(content)`

Edit the message (only your own messages).

```typescript
await message.edit('Edited content');
```

**Parameters:**
- `content` - New message content (string)

**Returns:** `Promise<Message>`

### `delete()`

Delete the message.

```typescript
await message.delete();
```

**Returns:** `Promise<void>`

### `react(emoji)`

Add a reaction to the message.

```typescript
await message.react('👍');
await message.react('❤️');
await message.react('customEmoji:123456789');
```

**Parameters:**
- `emoji` - Emoji (unicode or custom format `name:id`)

**Returns:** `Promise<void>`

### `unreact(emoji)`

Remove your reaction from the message.

```typescript
await message.unreact('👍');
```

**Parameters:**
- `emoji` - Emoji to remove

**Returns:** `Promise<void>`

### `removeReaction(emoji, userId)`

Remove a user's reaction (requires manage messages permission).

```typescript
await message.removeReaction('👍', 'USER_ID');
```

**Parameters:**
- `emoji` - Emoji
- `userId` - User ID

**Returns:** `Promise<void>`

### `getReactions(emoji, limit?)`

Get users who reacted with an emoji.

```typescript
const users = await message.getReactions('👍', 25);
users.forEach(user => console.log(user.tag));
```

**Parameters:**
- `emoji` - Emoji
- `limit` - Maximum users to fetch (default: 25)

**Returns:** `Promise<User[]>`

### `pin()`

Pin the message to the channel.

```typescript
await message.pin();
```

**Returns:** `Promise<void>`

### `unpin()`

Unpin the message from the channel.

```typescript
await message.unpin();
```

**Returns:** `Promise<void>`

### `forward(target)`

Forward the message to another channel or user DM.

```typescript
// Forward to channel
await message.forward('CHANNEL_ID');

// Forward to user DM
const user = await client.fetchUser('USER_ID');
await message.forward(user);
```

**Parameters:**
- `target` - Channel ID (string) or User object

**Returns:** `Promise<Message>`

## Example

```typescript
client.on('messageCreate', async (message) => {
  console.log(`[${message.time}] ${message.author.tag}: ${message.content}`);
  
  if (message.content === '!ping') {
    await message.reply('Pong!');
  }
  
  if (message.content === '!delete') {
    await message.delete();
  }
  
  if (message.content.includes('react')) {
    await message.react('✅');
  }
});
```