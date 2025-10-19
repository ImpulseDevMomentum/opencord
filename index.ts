'use strict';

// Root Classes starting points
export { Client } from './src/client/Client';
export type { ClientOptions } from './src/client/Client';
export { Gateway } from './src/client/Gateway';
export type { GatewayOptions } from './src/client/Gateway';

// Errors
export { DiscordAPIError, DiscordHTTPError } from './src/errors';

// Utilities
export { Constants, Intents } from './src/util';

// Structures
export { User, Message, Channel, Guild, ChannelType } from './src/struct';
export type { UserData, MessageData, ChannelData, GuildData } from './src/struct';

// HTTP
export { RequestManager } from './src/fetch';
export type { RequestOptions } from './src/fetch';