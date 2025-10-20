'use strict';

import { Base } from './Base';
import { Channel, ChannelData } from './Channel';
import type { IClient } from '../client/ClientTypes';
import { Constants } from '../util';
import { NitroRequiredError, TODOError } from '../errors';

export interface GuildData {
  id: string;
  name: string;
  icon: string | null;
  icon_hash?: string | null;
  owner_id: string;
  region?: string;
  member_count?: number;
  online_count?: number;
  description?: string | null;
  banner_hash?: string | null;
  custom_banner_hash?: string | null;
  tag?: string | null;
  badge?: number;
  badge_color_primary?: string;
  badge_color_secondary?: string;
  badge_hash?: string | null;
  features?: string[];
  premium_subscription_count?: number;
  premium_tier?: number;
  visibility?: number;
  channels?: ChannelData[];
}

export class Guild extends Base {
  public id: string;
  public name: string;
  public icon: string | null;
  public ownerId: string;
  public region?: string;
  public memberCount?: number;
  public onlineCount?: number;
  public description?: string | null;
  public banner: string | null;
  public customBanner: string | null;
  public tag?: string | null;
  public badge?: number;
  public badgeColorPrimary?: string;
  public badgeColorSecondary?: string;
  public features: string[];
  public boostCount: number;
  public boostTier: number;
  public visibility?: number;
  public channels: Map<string, Channel>;

  constructor(client: IClient, data: GuildData) {
    super(client);
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.ownerId = data.owner_id;
    this.region = data.region;
    this.memberCount = data.member_count;
    this.onlineCount = data.online_count;
    this.description = data.description;
    this.banner = data.banner_hash || data.custom_banner_hash || null;
    this.customBanner = data.custom_banner_hash || null;
    this.tag = data.tag;
    this.badge = data.badge;
    this.badgeColorPrimary = data.badge_color_primary;
    this.badgeColorSecondary = data.badge_color_secondary;
    this.features = data.features || [];
    this.boostCount = data.premium_subscription_count || 0;
    this.boostTier = data.premium_tier || 0;
    this.visibility = data.visibility;
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

  public bannerURL(size: number = 512): string | null {
    if (!this.banner) return null;
    return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${
      this.banner.startsWith('a_') ? 'gif' : 'png'
    }?size=${size}`;
  }

  public get boostLevel(): number {
    return this.boostTier;
  }

  public get totalBoosts(): number {
    return this.boostCount;
  }

  public get isVerified(): boolean {
    return this.features.includes('VERIFIED');
  }

  public get isPartnered(): boolean {
    return this.features.includes('PARTNERED');
  }

  public get hasVanityURL(): boolean {
    return this.features.includes('VANITY_URL');
  }

  public get isDiscoverable(): boolean {
    return this.features.includes('DISCOVERABLE');
  }

  public async fetchChannels(): Promise<Channel[]> {
    const data = await this.client.api.get(Constants.Endpoints.GUILD_CHANNELS(this.id));
    const channels = data.map((c: ChannelData) => new Channel(this.client, c));
    for (const channel of channels) {
      this.channels.set(channel.id, channel);
    }
    return channels;
  }

  public async addBoost(count: number = 1): Promise<void> {
    if (!this.client.user) {
      throw new Error('Client user not ready');
    }

    const premiumType = (this.client.user as any).premiumType || 0;
    
    if (premiumType === 0) {
      throw new NitroRequiredError();
    }

    for (let i = 0; i < count; i++) {
      await this.client.api.put(
        Constants.Endpoints.GUILD_BOOST(this.id),
        {}
      );
    }
  }

  public async buyBoost(count: number = 1): Promise<void> {
    throw new TODOError();
  }

  public toString(): string {
    return this.name;
  }
}