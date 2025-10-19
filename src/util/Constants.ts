'use strict';

export const Constants = {
  API_VERSION: 9,
  API_BASE_URL: 'https://discord.com/api/v9',
  GATEWAY_VERSION: 9,
  GATEWAY_ENCODING: 'json',
  
  Endpoints: {
    USER: (userId: string) => `/users/${userId}`,
    CHANNELS: (channelId: string) => `/channels/${channelId}`,
    MESSAGES: (channelId: string) => `/channels/${channelId}/messages`,
    MESSAGE: (channelId: string, messageId: string) => `/channels/${channelId}/messages/${messageId}`,
    GUILDS: (guildId: string) => `/guilds/${guildId}`,
    GUILD_CHANNELS: (guildId: string) => `/guilds/${guildId}/channels`,
    GUILD_MEMBERS: (guildId: string) => `/guilds/${guildId}/members`,
    GUILD_MEMBER: (guildId: string, userId: string) => `/guilds/${guildId}/members/${userId}`,
    TYPING: (channelId: string) => `/channels/${channelId}/typing`,
    ME: '/users/@me',
    ME_GUILDS: '/users/@me/guilds',
    ME_CHANNELS: '/users/@me/channels',
    GATEWAY: '/gateway',
  },

  OPCodes: {
    DISPATCH: 0,
    HEARTBEAT: 1,
    IDENTIFY: 2,
    PRESENCE_UPDATE: 3,
    VOICE_STATE_UPDATE: 4,
    RESUME: 6,
    RECONNECT: 7,
    REQUEST_GUILD_MEMBERS: 8,
    INVALID_SESSION: 9,
    HELLO: 10,
    HEARTBEAT_ACK: 11,
  },

  Events: {
    READY: 'READY',
    MESSAGE_CREATE: 'MESSAGE_CREATE',
    MESSAGE_UPDATE: 'MESSAGE_UPDATE',
    MESSAGE_DELETE: 'MESSAGE_DELETE',
    GUILD_CREATE: 'GUILD_CREATE',
    GUILD_UPDATE: 'GUILD_UPDATE',
    GUILD_DELETE: 'GUILD_DELETE',
    CHANNEL_CREATE: 'CHANNEL_CREATE',
    CHANNEL_UPDATE: 'CHANNEL_UPDATE',
    CHANNEL_DELETE: 'CHANNEL_DELETE',
    TYPING_START: 'TYPING_START',
    PRESENCE_UPDATE: 'PRESENCE_UPDATE',
  },
};