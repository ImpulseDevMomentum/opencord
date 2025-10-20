# Client

Main client class for connecting to Discord.

## Constructor

```typescript
new Client(options: ClientOptions)
```

### Example

```typescript
import { Client, Intents } from 'opencord';

const client = new Client({
  token: 'YOUR_USER_TOKEN',
  intents: Intents.combine(
    Intents.GUILDS,
    Intents.GUILD_MESSAGES,
    Intents.MESSAGE_CONTENT
  )
});
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `token` | `string` | User token |
| `api` | `RequestManager` | HTTP API manager |
| `gateway` | `Gateway` | WebSocket gateway |
| `user` | `User?` | Current user (after ready) |
| `guilds` | `Map<string, Guild>` | Cached guilds |
| `channels` | `Map<string, Channel>` | Cached channels |
| `users` | `Map<string, User>` | Cached users |

## Methods

### `login()`

Connect to Discord gateway.

```typescript
await client.login();
```

**Returns:** `Promise<void>`

**Throws:**
- `InvalidTokenError` - Token is invalid or expired
- `EmptyTokenError` - Token is empty
- `BotTokenError` - Bot token provided

### `fetchUser(userId)`

Fetch a user by ID.

```typescript
const user = await client.fetchUser('123456789');
console.log(user.tag);
```

**Returns:** `Promise<User>`

### `fetchGuild(guildId)`

Fetch a guild by ID.

```typescript
const guild = await client.fetchGuild('123456789');
console.log(guild.name);
```

**Returns:** `Promise<Guild>`

### `fetchChannel(channelId)`

Fetch a channel by ID.

```typescript
const channel = await client.fetchChannel('123456789');
await channel.send('Hello!');
```

**Returns:** `Promise<Channel>`

### `fetchGuilds()`

Fetch all guilds the user is in.

```typescript
const guilds = await client.fetchGuilds();
guilds.forEach(g => console.log(g.name));
```

**Returns:** `Promise<Guild[]>`

### `setPresence(status, activity?)`

Set user presence/status.

```typescript
client.setPresence('online');
client.setPresence('dnd');
client.setPresence('idle');
client.setPresence('invisible');

client.setPresence('online', {
  name: 'with OpenCord',
  type: 0
});
```

**Parameters:**
- `status` - 'online' | 'idle' | 'dnd' | 'invisible'
- `activity` - Optional activity object

### `destroy()`

Disconnect and cleanup.

```typescript
client.destroy();
```

## Events

### `ready`

Fired when client is ready.

```typescript
client.on('ready', (user: User) => {
  console.log(`Ready as ${user.tag}`);
});
```

### `messageCreate`

Fired when a message is created.

```typescript
client.on('messageCreate', (message: Message) => {
  console.log(message.content);
});
```

### `messageUpdate`

Fired when a message is edited.

```typescript
client.on('messageUpdate', (message: Message) => {
  console.log('Message edited');
});
```

### `messageDelete`

Fired when a message is deleted.

```typescript
client.on('messageDelete', (data: { id: string, channelId: string, guildId?: string }) => {
  console.log(`Message ${data.id} deleted`);
});
```

### `guildCreate`

Fired when joining a guild.

```typescript
client.on('guildCreate', (guild: Guild) => {
  console.log(`Joined ${guild.name}`);
});
```

### `guildUpdate`

Fired when a guild is updated.

```typescript
client.on('guildUpdate', (guild: Guild) => {
  console.log(`${guild.name} updated`);
});
```

### `guildDelete`

Fired when leaving a guild.

```typescript
client.on('guildDelete', (guild: Guild) => {
  console.log(`Left ${guild.name}`);
});
```

### `channelCreate`

Fired when a channel is created.

```typescript
client.on('channelCreate', (channel: Channel) => {
  console.log(`Channel created: ${channel.name}`);
});
```

### `channelUpdate`

Fired when a channel is updated.

```typescript
client.on('channelUpdate', (channel: Channel) => {
  console.log(`Channel updated`);
});
```

### `channelDelete`

Fired when a channel is deleted.

```typescript
client.on('channelDelete', (channel: Channel) => {
  console.log(`Channel deleted`);
});
```

### `typingStart`

Fired when someone starts typing.

```typescript
client.on('typingStart', (data: { channelId: string, userId: string, timestamp: Date }) => {
  console.log(`User ${data.userId} is typing`);
});
```

### `error`

Fired on errors.

```typescript
client.on('error', (error: Error) => {
  console.error('Error:', error);
});
```

### `debug`

Fired for debug messages.

```typescript
client.on('debug', (message: string) => {
  console.log('[DEBUG]', message);
});
```

### `raw`

Fired for raw gateway packets.

```typescript
client.on('raw', (packet: any) => {
  console.log('RAW:', packet);
});
```