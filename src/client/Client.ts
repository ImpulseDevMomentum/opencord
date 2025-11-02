'use strict';

import { EventEmitter } from 'events';
import { Gateway } from './Gateway';
import { RequestManager } from '../fetch';
import { User, UserData, Guild, GuildData, Channel, ChannelData, Message, MessageData } from '../struct';
import { Constants } from '../util';
import { EmptyTokenError, BotTokenError } from '../errors';

export interface ClientOptions {
  token: string;
}

export class Client extends EventEmitter {
  public token: string;
  public api: RequestManager;
  public gateway: Gateway;
  public user: User | null = null;
  public guilds: Map<string, Guild> = new Map();
  public channels: Map<string, Channel> = new Map();
  public users: Map<string, User> = new Map();

  constructor(options: ClientOptions) {
    super();
    
    if (!options.token || options.token.trim() === '') {
      throw new EmptyTokenError();
    }
    
    if (options.token.startsWith('Bot ') || options.token.startsWith('bot ')) {
      throw new BotTokenError();
    }
    
    this.token = options.token;
    this.api = new RequestManager(this.token);
    this.gateway = new Gateway({
      token: this.token,
    });

    this.setupGatewayListeners();
  }

  private setupGatewayListeners(): void {
    this.gateway.on('debug', (message: string) => {
      this.emit('debug', message);
    });

    this.gateway.on('error', (error: Error) => {
      this.emit('error', error);
    });

    this.gateway.on('raw', (packet: any) => {
      this.emit('raw', packet);
    });

    this.gateway.on('READY', (data: any) => {
      this.user = new User(this, data.user);
      this.users.set(this.user.id, this.user);

      for (const guildData of data.guilds) {
        const guild = new Guild(this, guildData);
        this.guilds.set(guild.id, guild);
      }

      this.emit('ready', this.user);
    });

    this.gateway.on('MESSAGE_CREATE', (data: MessageData) => {
      const message = new Message(this, data);
      
      if (!this.users.has(message.author.id)) {
        this.users.set(message.author.id, message.author);
      }

      this.emit('messageCreate', message);
    });

    this.gateway.on('MESSAGE_UPDATE', (data: MessageData) => {
      const message = new Message(this, data);
      this.emit('messageUpdate', message);
    });

    this.gateway.on('MESSAGE_DELETE', (data: any) => {
      this.emit('messageDelete', {
        id: data.id,
        channelId: data.channel_id,
        guildId: data.guild_id,
      });
    });

    this.gateway.on('GUILD_CREATE', (data: GuildData) => {
      const guild = new Guild(this, data);
      this.guilds.set(guild.id, guild);

      if (data.channels) {
        for (const channelData of data.channels) {
          const channel = new Channel(this, channelData);
          this.channels.set(channel.id, channel);
        }
      }

      this.emit('guildCreate', guild);
    });

    this.gateway.on('GUILD_UPDATE', (data: GuildData) => {
      const guild = new Guild(this, data);
      this.guilds.set(guild.id, guild);
      this.emit('guildUpdate', guild);
    });

    this.gateway.on('GUILD_DELETE', (data: any) => {
      const guild = this.guilds.get(data.id);
      if (guild) {
        this.guilds.delete(data.id);
        this.emit('guildDelete', guild);
      }
    });

    this.gateway.on('CHANNEL_CREATE', (data: ChannelData) => {
      const channel = new Channel(this, data);
      this.channels.set(channel.id, channel);
      
      if (channel.guildId) {
        const guild = this.guilds.get(channel.guildId);
        if (guild) {
          guild.channels.set(channel.id, channel);
        }
      }

      this.emit('channelCreate', channel);
    });

    this.gateway.on('CHANNEL_UPDATE', (data: ChannelData) => {
      const channel = new Channel(this, data);
      this.channels.set(channel.id, channel);
      
      if (channel.guildId) {
        const guild = this.guilds.get(channel.guildId);
        if (guild) {
          guild.channels.set(channel.id, channel);
        }
      }

      this.emit('channelUpdate', channel);
    });

    this.gateway.on('CHANNEL_DELETE', (data: ChannelData) => {
      const channel = this.channels.get(data.id);
      if (channel) {
        this.channels.delete(data.id);
        
        if (channel.guildId) {
          const guild = this.guilds.get(channel.guildId);
          if (guild) {
            guild.channels.delete(channel.id);
          }
        }

        this.emit('channelDelete', channel);
      }
    });

    this.gateway.on('TYPING_START', (data: any) => {
      this.emit('typingStart', {
        channelId: data.channel_id,
        userId: data.user_id,
        timestamp: new Date(data.timestamp * 1000),
      });
    });

    this.gateway.on('PRESENCE_UPDATE', (data: any) => {
      this.emit('presenceUpdate', {
        userId: data.user.id,
        status: data.status,
        activities: data.activities,
      });
    });

    this.gateway.on('VOICE_STATE_UPDATE', (data: any) => {
      this.emit('voiceStateUpdate', {
        userId: data.user.id,
        channelId: data.channel_id,
        guildId: data.guild_id,
      });
    });

    this.gateway.on('USER_UPDATE', (data: UserData) => {
      const user = new User(this, data);
      this.users.set(user.id, user);
      this.emit('userUpdate', user);
    });
  }

  public async login(): Promise<void> {
    const gatewayData = await this.api.get(Constants.Endpoints.GATEWAY);
    await this.gateway.connect(gatewayData.url);
  }

  public async fetchUser(userId: string): Promise<User> {
    const data = await this.api.get(Constants.Endpoints.USER(userId));
    const user = new User(this, data);
    this.users.set(user.id, user);
    return user;
  }

  public async fetchGuild(guildId: string): Promise<Guild> {
    const data = await this.api.get(Constants.Endpoints.GUILDS(guildId));
    const guild = new Guild(this, data);
    this.guilds.set(guild.id, guild);
    return guild;
  }

  public async fetchChannel(channelId: string): Promise<Channel> {
    const data = await this.api.get(Constants.Endpoints.CHANNELS(channelId));
    const channel = new Channel(this, data);
    this.channels.set(channel.id, channel);
    return channel;
  }

  public async fetchGuilds(): Promise<Guild[]> {
    const data = await this.api.get(Constants.Endpoints.ME_GUILDS);
    const guilds = data.map((g: GuildData) => {
      const guild = new Guild(this, g);
      this.guilds.set(guild.id, guild);
      return guild;
    });
    return guilds;
  }

  public setPresence(status: 'online' | 'idle' | 'dnd' | 'invisible', activity?: {
    name: string;
    type: number;
  }): void {
    this.gateway.updatePresence(status, activity);
  }

  public destroy(): void {
    this.gateway.disconnect();
    this.removeAllListeners();
  }
}