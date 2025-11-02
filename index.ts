'use strict';

// Root Classes starting points
export { Client } from './src/client/Client';
export type { ClientOptions } from './src/client/Client';
export { Gateway } from './src/client/Gateway';
export type { GatewayOptions } from './src/client/Gateway';

// Errors
export { DiscordAPIError, DiscordHTTPError, OpencordError, EmptyTokenError, BotTokenError, InvalidTokenError, NitroRequiredError, TODOError, CommandNotFoundError, CommandMetadataNotFoundError } from './src/errors';

// Utilities
export { Constants, Permissions, PermissionsBits, eCommand, createCommandOption } from './src/util';

// Structures
export { User, Message, Channel, Guild, ChannelType, CommandOptionType, CommandType } from './src/struct';
export type { UserData, MessageData, ChannelData, GuildData, CommandData, CommandOption, CommandOptionChoice, ApplicationCommandResponse } from './src/struct';

// Builders
export { InteractionBuilder } from './src/builders';

// HTTP
export { RequestManager } from './src/fetch';
export type { RequestOptions } from './src/fetch';