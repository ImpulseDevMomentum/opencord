# API Reference

Complete API documentation for OpenCord.

## Core Classes

- [Client](client.md) - Main client class
- [Message](message.md) - Message operations
- [Channel](channel.md) - Channel operations
- [Guild](guild.md) - Guild/Server operations
- [User](user.md) - User and profile data
- [Gateway](gateway.md) - WebSocket gateway

## Utilities

- [Intents](../advanced/intents.md) - Gateway intents
- [Constants](constants.md) - API constants

## Errors

All errors extend `OpencordError`:

- `EmptyTokenError` - Token is empty
- `BotTokenError` - Bot token provided instead of user token
- `InvalidTokenError` - Invalid or expired token
- `NitroRequiredError` - Feature requires Nitro subscription
- `TODOError` - Feature not implemented yet
- `DiscordAPIError` - Discord API returned an error
- `DiscordHTTPError` - HTTP error from Discord

## Type Definitions

All classes and interfaces are fully typed. Import types:

```typescript
import type { 
  UserData, 
  MessageData, 
  ChannelData, 
  GuildData,
  GuildMemberData,
  BadgeData
} from 'opencord';
```