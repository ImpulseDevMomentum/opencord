'use strict';

import { Base } from './Base';
import { Message, MessageData } from './Message';
import type { IClient } from '../client/ClientTypes';
import { Constants } from '../util';

export enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_ANNOUNCEMENT = 5,
  GUILD_STORE = 6,
  ANNOUNCEMENT_THREAD = 10,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
  GUILD_DIRECTORY = 14,
  GUILD_FORUM = 15,
}

export interface ChannelData {
  id: string;
  type: ChannelType;
  guild_id?: string;
  position?: number;
  name?: string;
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: string | null;
  parent_id?: string | null;
}

export class Channel extends Base {
  public id: string;
  public type: ChannelType;
  public guildId?: string;
  public position?: number;
  public name?: string;
  public topic?: string | null;
  public nsfw?: boolean;
  public lastMessageId?: string | null;
  public parentId?: string | null;

  constructor(client: IClient, data: ChannelData) {
    super(client);
    this.id = data.id;
    this.type = data.type;
    this.guildId = data.guild_id;
    this.position = data.position;
    this.name = data.name;
    this.topic = data.topic;
    this.nsfw = data.nsfw;
    this.lastMessageId = data.last_message_id;
    this.parentId = data.parent_id;
  }

  public async send(content: string): Promise<Message> {
    const data = await this.client.api.post(Constants.Endpoints.MESSAGES(this.id), {
      content,
    });
    return new Message(this.client, data);
  }

  public async fetchMessages(limit: number = 50): Promise<Message[]> {
    const data = await this.client.api.get(
      `${Constants.Endpoints.MESSAGES(this.id)}?limit=${limit}`
    );
    return data.map((m: MessageData) => new Message(this.client, m));
  }

  public async startTyping(): Promise<void> {
    await this.client.api.post(Constants.Endpoints.TYPING(this.id), {});
  }

  public toString(): string {
    return `<#${this.id}>`;
  }
}