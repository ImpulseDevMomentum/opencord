# Guild

Represents a Discord server/guild.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Guild ID |
| `name` | `string` | Guild name |
| `icon` | `string?` | Icon hash |
| `ownerId` | `string` | Owner user ID |
| `memberCount` | `number?` | Total members |
| `onlineCount` | `number?` | Online members |
| `description` | `string?` | Guild description |
| `banner` | `string?` | Banner hash |
| `tag` | `string?` | Guild tag |
| `boostCount` | `number` | Number of boosts |
| `boostTier` | `number` | Boost level (0-3) |
| `features` | `string[]` | Guild features |
| `channels` | `Map<string, Channel>` | Cached channels |

## Getters

### `boostLevel`

Current boost tier (0-3).

```typescript
console.log(guild.boostLevel); // 0, 1, 2, or 3
```

### `totalBoosts`

Total number of boosts.

```typescript
console.log(guild.totalBoosts); // 14
```

### `isVerified`

Whether the guild is verified.

```typescript
if (guild.isVerified) {
  console.log('Verified server!');
}
```

### `isPartnered`

Whether the guild is a Discord partner.

```typescript
if (guild.isPartnered) {
  console.log('Partnered server!');
}
```

### `hasVanityURL`

Whether the guild has a custom vanity URL.

```typescript
if (guild.hasVanityURL) {
  console.log('Has vanity URL');
}
```

### `isDiscoverable`

Whether the guild is discoverable in server discovery.

```typescript
if (guild.isDiscoverable) {
  console.log('Public server');
}
```

## Methods

### `iconURL(size?)`

Get guild icon URL.

```typescript
const url = guild.iconURL(256);
console.log(url);
```

**Parameters:**
- `size` - Image size (default: 128)

**Returns:** `string | null`

### `bannerURL(size?)`

Get guild banner URL.

```typescript
const url = guild.bannerURL(512);
console.log(url);
```

**Parameters:**
- `size` - Image size (default: 512)

**Returns:** `string | null`

### `fetchChannels()`

Fetch all channels in the guild.

```typescript
const channels = await guild.fetchChannels();
channels.forEach(c => console.log(c.name));
```

**Returns:** `Promise<Channel[]>`

### `addBoost(count?)`

Add server boosts using Nitro.

```typescript
await guild.addBoost(2);
```

**Parameters:**
- `count` - Number of boosts to add (default: 1)

**Returns:** `Promise<void>`

**Throws:**
- `NitroRequiredError` - User doesn't have Nitro

### `buyBoost(count?)`

Buy server boosts (not implemented).

```typescript
await guild.buyBoost(1);
```

**Parameters:**
- `count` - Number of boosts to buy (default: 1)

**Returns:** `Promise<void>`

**Throws:**
- `TODOError` - Feature not implemented yet

## Example

```typescript
const guild = await client.fetchGuild('GUILD_ID');

console.log(`${guild.name}`);
console.log(`Members: ${guild.memberCount}`);
console.log(`Boost Level: ${guild.boostLevel}`);
console.log(`Verified: ${guild.isVerified ? 'Yes' : 'No'}`);

try {
  await guild.addBoost(2);
  console.log('Boosted server!');
} catch (error) {
  if (error instanceof NitroRequiredError) {
    console.log('Need Nitro to boost');
  }
}
```