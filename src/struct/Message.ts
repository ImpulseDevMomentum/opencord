'use strict';

import { Base } from './Base';
import { User, UserData } from './User';
import type { IClient } from '../client/ClientTypes';
import { Constants } from '../util';

export interface MessageData {
  id: string;
  channel_id: string;
  author: UserData;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: UserData[];
  attachments: any[];
  embeds: any[];
  type: number;
}

export class Message extends Base {
  public id: string;
  public channelId: string;
  public author: User;
  public content: string;
  public timestamp: Date;
  public editedTimestamp: Date | null;
  public tts: boolean;
  public mentionEveryone: boolean;
  public mentions: User[];
  public attachments: any[];
  public embeds: any[];
  public type: number;

  constructor(client: IClient, data: MessageData) {
    super(client);
    this.id = data.id;
    this.channelId = data.channel_id;
    this.author = new User(client, data.author);
    this.content = data.content;
    this.timestamp = new Date(data.timestamp);
    this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
    this.tts = data.tts;
    this.mentionEveryone = data.mention_everyone;
    this.mentions = data.mentions.map(u => new User(client, u));
    this.attachments = data.attachments;
    this.embeds = data.embeds;
    this.type = data.type;
  }

  public async reply(content: string): Promise<Message> {
    const data = await this.client.api.post(
      Constants.Endpoints.MESSAGES(this.channelId),
      {
        content,
        message_reference: {
          message_id: this.id,
        },
      }
    );
    return new Message(this.client, data);
  }

  public async edit(content: string): Promise<Message> {
    const data = await this.client.api.patch(
      Constants.Endpoints.MESSAGE(this.channelId, this.id),
      { content }
    );
    return new Message(this.client, data);
  }

  public async delete(): Promise<void> {
    await this.client.api.delete(Constants.Endpoints.MESSAGE(this.channelId, this.id));
  }
}