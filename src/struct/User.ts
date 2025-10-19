'use strict';

import { Base } from './Base';
import type { IClient } from '../client/ClientTypes';

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
}

export class User extends Base {
  public id: string;
  public username: string;
  public discriminator: string;
  public avatar: string | null;
  public bot: boolean;
  public system: boolean;

  constructor(client: IClient, data: UserData) {
    super(client);
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar;
    this.bot = data.bot || false;
    this.system = data.system || false;
  }

  public get tag(): string {
    return `${this.username}#${this.discriminator}`;
  }

  public avatarURL(size: number = 128): string | null {
    if (!this.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${
      this.avatar.startsWith('a_') ? 'gif' : 'png'
    }?size=${size}`;
  }

  public toString(): string {
    return `<@${this.id}>`;
  }
}