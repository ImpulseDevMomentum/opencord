# Channel

Represents a Discord channel.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Channel ID |
| `type` | `ChannelType` | Channel type |
| `guildId` | `string?` | Guild ID (if in guild) |
| `name` | `string?` | Channel name |
| `topic` | `string?` | Channel topic |
| `nsfw` | `boolean?` | NSFW flag |
| `parentId` | `string?` | Parent category ID |

## Channel Types

```typescript
enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_ANNOUNCEMENT = 5,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  GUILD_FORUM = 15,
}
```

## Methods

### `send(content)`

Send a message to the channel.

```typescript
const message = await channel.send('Hello, world!');
```

**Parameters:**
- `content` - Message content (string)

**Returns:** `Promise<Message>`

### `fetchMessages(limit?)`

Fetch recent messages from the channel.

```typescript
const messages = await channel.fetchMessages(50);
messages.forEach(m => console.log(m.content));
```

**Parameters:**
- `limit` - Number of messages to fetch (default: 50, max: 100)

**Returns:** `Promise<Message[]>`

### `startTyping()`

Show typing indicator in the channel.

```typescript
await channel.startTyping();
// Typing indicator shows for ~10 seconds or until you send a message
await channel.send('Done!');
```

**Returns:** `Promise<void>`

## Example

```typescript
const channel = await client.fetchChannel('CHANNEL_ID');

// Send message
await channel.send('Hello!');

// Show typing
await channel.startTyping();
await new Promise(r => setTimeout(r, 2000));
await channel.send('Typing done!');

// Fetch messages
const messages = await channel.fetchMessages(10);
console.log(`Fetched ${messages.length} messages`);
```

## toString()

Converts to mention format:

```typescript
console.log(channel.toString()); // "<#123456789>"
```