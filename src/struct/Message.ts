'use strict';

import { Base } from './Base';
import { User, UserData } from './User';
import type { IClient } from '../client/ClientTypes';
import { Constants } from '../util';
import { InvalidCrossPostChannelError } from '../errors';

export interface MessageData {
  id: string;
  channel_id: string;
  guild_id?: string;
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
  public guildId?: string;
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
    this.guildId = data.guild_id;
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

  public get time(): string {
    return this.timestamp.toLocaleTimeString('en-US');
  }

  public get date(): string {
    return this.timestamp.toLocaleString('pl-PL');
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

  public async send(content: string): Promise<Message> {
    const data = await this.client.api.post(Constants.Endpoints.MESSAGE(this.channelId, this.id), {
      content
    });
    return new Message(this.client, data as MessageData);
  }

  public async react(emoji: string): Promise<void> {
    await this.client.api.put(
      Constants.Endpoints.MESSAGE_REACTION(this.channelId, this.id, emoji),
      {}
    );
  }

  public async unreact(emoji: string): Promise<void> {
    await this.client.api.delete(
      Constants.Endpoints.MESSAGE_REACTION(this.channelId, this.id, emoji)
    );
  }

  public async removeReaction(emoji: string, userId: string): Promise<void> {
    await this.client.api.delete(
      Constants.Endpoints.MESSAGE_REACTION_USER(this.channelId, this.id, emoji, userId)
    );
  }

  public async getReactions(emoji: string, limit: number = 25): Promise<User[]> {
    const endpoint = `/channels/${this.channelId}/messages/${this.id}/reactions/${encodeURIComponent(emoji)}?limit=${limit}`;
    const data = await this.client.api.get(endpoint);
    return data.map((u: UserData) => new User(this.client, u));
  }

  public async pin(): Promise<void> {
    await this.client.api.put(
      Constants.Endpoints.PIN_MESSAGE(this.channelId, this.id),
      {}
    );
  }

  public async unpin(): Promise<void> {
    await this.client.api.delete(
      Constants.Endpoints.UNPIN_MESSAGE(this.channelId, this.id)
    );
  }

  public async forward(target: string | User): Promise<Message> {
    let targetChannelId: string;

    if (typeof target === 'object' && target instanceof User) {
      const dmData = await this.client.api.post(Constants.Endpoints.CREATE_DM, {
        recipient_id: target.id,
      });
      targetChannelId = dmData.id;
    } else {
      targetChannelId = target;
    }

    const data = await this.client.api.post(
      Constants.Endpoints.MESSAGES(targetChannelId),
      {
        content: "",
        message_reference: {
          type: 1,
          message_id: this.id,
          channel_id: this.channelId,
          guild_id: this.guildId,
          fail_if_not_exists: false
        },
        message_snapshots: [
          {
            message: {
              type: 0,
              content: this.content,
              mentions: [],
              mention_roles: [],
              attachments: [],
              embeds: [],
              timestamp: this.timestamp.toISOString(),
              edited_timestamp: null,
              flags: 0,
              components: []
            }
          }
        ],
        flags: 16384,
        tts: false
      }
    );
    return new Message(this.client, data);
  }

  public async crosspost(targetChannelId?: string): Promise<Message> {
    try {
      const channelId = targetChannelId || this.channelId;
      const data = await this.client.api.post(
        Constants.Endpoints.CROSSPOST_MESSAGE(channelId, this.id),
        {}
      );
      return new Message(this.client, data);
    } catch (error) {
      throw new InvalidCrossPostChannelError();
    }
  }
  
  // TODO: bulk message deletion, tread creation
}