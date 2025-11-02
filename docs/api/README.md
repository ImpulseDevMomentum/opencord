# API Reference

Complete API documentation for OpenCord.

## Core Classes

- [Client](client.md) - Main client class
- [Message](message.md) - Message operations
- [Channel](channel.md) - Channel operations
- [Guild](guild.md) - Guild/Server operations
- [User](user.md) - User and profile data
- [Commands](command.md) - Slash commands and interactions
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
- `CommandNotFoundError` - Command not found in guild
- `CommandMetadataNotFoundError` - Command metadata not found
- `CrosspostError` - Failed to crosspost message

## Type Definitions

All classes and interfaces are fully typed. Import types:

```typescript
import type { 
  UserData, 
  MessageData, 
  ChannelData, 
  GuildData,
  GuildMemberData,
  BadgeData,
  CommandData,
  CommandOption,
  CommandOptionChoice,
  ApplicationCommandResponse
} from 'opencord';
```