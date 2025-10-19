'use strict';

import { Base } from './Base';
import { Channel, ChannelData } from './Channel';
import type { IClient } from '../client/ClientTypes';
import { Constants } from '../util';

export interface GuildData {
  id: string;
  name: string;
  icon: string | null;
  owner_id: string;
  region?: string;
  member_count?: number;
  channels?: ChannelData[];
}

export class Guild extends Base {
  public id: string;
  public name: string;
  public icon: string | null;
  public ownerId: string;
  public region?: string;
  public memberCount?: number;
  public channels: Map<string, Channel>;

  constructor(client: IClient, data: GuildData) {
    super(client);
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.ownerId = data.owner_id;
    this.region = data.region;
    this.memberCount = data.member_count;
    this.channels = new Map();

    if (data.channels) {
      for (const channelData of data.channels) {
        const channel = new Channel(client, channelData);
        this.channels.set(channel.id, channel);
      }
    }
  }

  public iconURL(size: number = 128): string | null {
    if (!this.icon) return null;
    return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.${
      this.icon.startsWith('a_') ? 'gif' : 'png'
    }?size=${size}`;
  }

  public async fetchChannels(): Promise<Channel[]> {
    const data = await this.client.api.get(Constants.Endpoints.GUILD_CHANNELS(this.id));
    const channels = data.map((c: ChannelData) => new Channel(this.client, c));
    for (const channel of channels) {
      this.channels.set(channel.id, channel);
    }
    return channels;
  }

  public toString(): string {
    return this.name;
  }
}