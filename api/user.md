# User

Represents a Discord user.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | User ID |
| `username` | `string` | Username |
| `discriminator` | `string` | User discriminator |
| `avatar` | `string?` | Avatar hash |
| `bot` | `boolean` | Whether user is a bot |
| `system` | `boolean` | Whether user is a system user |
| `globalName` | `string?` | Global display name |
| `banner` | `string?` | Banner hash |
| `bannerColor` | `string?` | Banner color |
| `accentColor` | `number?` | Accent color |
| `bio` | `string` | User bio |
| `publicFlags` | `number` | Public flags |
| `premiumType` | `number` | Nitro type |
| `premiumSince` | `Date?` | Nitro since date |
| `badges` | `BadgeData[]` | User badges |
| `guildMember` | `GuildMemberData?` | Guild member data |
| `mutualGuilds` | `Map<string, Guild>` | Mutual guilds |

## Getters

### `tag`

User's tag (discriminator).

```typescript
console.log(user.tag); // #0
```

### `displayName`

User's display name (global name or username).

```typescript
console.log(user.displayName); // "John Doe" or "john_doe"
```

## Methods

### `avatarURL(size?)`

Get user avatar URL.

```typescript
const url = user.avatarURL(256);
console.log(url);
```

**Parameters:**
- `size` - Image size (default: 128)

**Returns:** `string | null`

### `bannerURL(size?)`

Get user banner URL.

```typescript
const url = user.bannerURL(512);
console.log(url);
```

**Parameters:**
- `size` - Image size (default: 512)

**Returns:** `string | null`

### `fetchProfile(guildId?)`

Fetch complete user profile.

```typescript
const profile = await user.fetchProfile();
console.log(profile.bio);
console.log(profile.badges);
```

**Parameters:**
- `guildId` - Optional guild ID for guild-specific data

**Returns:** `Promise<User>`

### `getBio(guildId?)`

Get user bio.

```typescript
const bio = await user.getBio();
console.log(bio);
```

**Parameters:**
- `guildId` - Optional guild ID

**Returns:** `Promise<string>`

### `getBadges()`

Get user badges.

```typescript
const badges = await user.getBadges();
badges.forEach(badge => console.log(badge.description));
```

**Returns:** `Promise<BadgeData[]>`

### `getGuildRoles(guildId)`

Get user roles in a guild.

```typescript
const roles = await user.getGuildRoles('GUILD_ID');
console.log(roles);
```

**Parameters:**
- `guildId` - Guild ID

**Returns:** `Promise<string[]>`

### `getGuildMember(guildId)`

Get guild member data.

```typescript
const member = await user.getGuildMember('GUILD_ID');
console.log(member.nick);
console.log(member.joinedAt);
```

**Parameters:**
- `guildId` - Guild ID

**Returns:** `Promise<GuildMemberData | null>`

### `getMutualGuilds()`

Get mutual guilds with helper methods.

```typescript
const mutualGuilds = await user.getMutualGuilds();

const guildIds = mutualGuilds.Id();
console.log('Mutual guild IDs:', guildIds);

const count = mutualGuilds.Count();
console.log('Mutual guild count:', count);

mutualGuilds.forEach(guild => {
  console.log(guild.name);
});
```

**Returns:** `Promise<Guild[]>` - Array with helper methods

**Helper Methods:**
- `Id()` - Returns array of mutual guild IDs
- `Count()` - Returns number of mutual guilds

## Example

```typescript
const user = await client.fetchUser('USER_ID');

console.log(`User: ${user.displayName}`);
console.log(`Avatar: ${user.avatarURL()}`);

const profile = await user.fetchProfile();
console.log(`Bio: ${profile.bio}`);

const mutualGuilds = await user.getMutualGuilds();
console.log('Mutual guild IDs:', mutualGuilds.Id());
console.log('Mutual guild count:', mutualGuilds.Count());

const guildMember = await user.getGuildMember('GUILD_ID');
if (guildMember) {
  console.log(`Nick: ${guildMember.nick}`);
  console.log(`Joined: ${guildMember.joinedAt}`);
}
```