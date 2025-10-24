'use strict';


// USER AKA PROFILE

import { Base } from './Base';
import type { IClient } from '../client/ClientTypes';
import { Guild } from './Guild';
import { Constants } from '../util';

export interface GuildMemberData {
  avatar: string | null;
  banner: string | null;
  communication_disabled_until: string | null;
  flags: number;
  joined_at: string;
  nick: string | null;
  pending: boolean;
  premium_since: string | null;
  roles: string[];
  bio: string;
  mute: boolean;
  deaf: boolean;
}

export interface BadgeData {
  id: string;
  description: string;
  icon: string;
}

export interface UserData {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  email?: string | null;
  verified?: boolean;
  phone?: string | null;
  global_name?: string | null;
  banner?: string | null;
  banner_color?: string | null;
  accent_color?: number | null;
  bio?: string;
  public_flags?: number;
  mutual_guilds?: string[];
  premium_type?: number;
  premium_since?: string | null;
  legacy_username?: string;
  badges?: BadgeData[];
  guild_member?: GuildMemberData;
}

export class User extends Base {
  public id: string;
  public username: string;
  public discriminator: string;
  public avatar: string | null;
  public bot: boolean;
  public system: boolean;
  public globalName: string | null;
  public banner: string | null;
  public bannerColor: string | null;
  public accentColor: number | null;
  public bio: string;
  public publicFlags: number;
  public premiumType: number;
  public premiumSince: Date | null;
  public legacyUsername: string | null;
  public badges: BadgeData[];
  public guildMember: GuildMemberData | null;
  public mutualGuilds: Map<string, Guild>;
  constructor(client: IClient, data: UserData) {
    super(client);
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar;
    this.mutualGuilds = new Map();
    if (data.mutual_guilds) {
      for (const mutualGuildData of data.mutual_guilds) {
        const guild = this.client.guilds.get(mutualGuildData);
        if (guild) {
          this.mutualGuilds.set(guild.id, guild);
        }
      }
    }
    this.bot = data.bot || false;
    this.system = data.system || false;
    this.globalName = data.global_name || null;
    this.banner = data.banner || null;
    this.bannerColor = data.banner_color || null;
    this.accentColor = data.accent_color || null;
    this.bio = data.bio || '';
    this.publicFlags = data.public_flags || 0;
    this.premiumType = data.premium_type || 0;
    this.premiumSince = data.premium_since ? new Date(data.premium_since) : null;
    this.legacyUsername = data.legacy_username || null;
    this.badges = data.badges || [];
    this.guildMember = data.guild_member || null;
  }

  public get tag(): string {
    return `${this.discriminator}`; // tho this will always return #0, added for consistency
  }

  public get displayName(): string {
    return this.globalName || this.username;
  }

  public avatarURL(size: number = 128): string | null {
    if (!this.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${
      this.avatar.startsWith('a_') ? 'gif' : 'png'
    }?size=${size}`;
  }

  public bannerURL(size: number = 512): string | null {
    if (!this.banner) return null;
    return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${
      this.banner.startsWith('a_') ? 'gif' : 'png'
    }?size=${size}`;
  }

  public async fetchProfile(guildId?: string): Promise<User> {
    const data = await this.client.api.get(
      `/users/${this.id}/profile${guildId ? `?guild_id=${guildId}` : ''}`
    );
    
    if (data.user) {
      Object.assign(this, new User(this.client, { ...data.user, ...data }));
    }
    
    return this;
  }

  public async getBio(guildId?: string): Promise<string> {
    if (!this.bio) {
      await this.fetchProfile(guildId);
    }
    return this.bio;
  }

  public async getBadges(): Promise<BadgeData[]> {
    if (this.badges.length === 0) {
      await this.fetchProfile();
    }
    return this.badges;
  }

  public async getGuildRoles(guildId: string): Promise<string[]> {
    if (!this.guildMember) {
      await this.fetchProfile(guildId);
    }
    return this.guildMember?.roles || [];
  }

  public async getGuildMember(guildId: string): Promise<GuildMemberData | null> {
    if (!this.guildMember) {
      await this.fetchProfile(guildId);
    }
    return this.guildMember;
  }

  public toString(): string {
    return `<@${this.id}>`;
  }

  public async getMutualGuilds(): Promise<Guild[]> {
    if (this.mutualGuilds.size > 0) {
      return Array.from(this.mutualGuilds.values());
    }

    const profileData = await this.client.api.get(Constants.Endpoints.USER_PROFILE(this.id));
    
    if (profileData.mutual_guilds && Array.isArray(profileData.mutual_guilds)) {
      const mutualGuilds: Guild[] = [];
      
      for (const mutualGuildData of profileData.mutual_guilds) {
        let guild = this.mutualGuilds.get(mutualGuildData.id);
        
        if (!guild) {
          try {
            guild = await this.client.guilds.get(mutualGuildData.id);
            if (guild) {
              this.mutualGuilds.set(guild.id, guild);
            }
          } catch (error) {
            continue;
          }
        }
        
        if (guild) {
          mutualGuilds.push(guild);
        }
      }
      
      for (const guild of mutualGuilds) {
        this.mutualGuilds.set(guild.id, guild);
      }
      
      const result = Array.from(this.mutualGuilds.values());
      (result as any).Id = () => profileData.mutual_guilds.map((guild: any) => guild.id);
      (result as any).Count = () => profileData.mutual_guilds.length;
      
      return result;
    }
    
    const emptyResult: any = [];
    emptyResult.Id = () => [];
    emptyResult.Count = () => 0;
    return emptyResult;
  }
}