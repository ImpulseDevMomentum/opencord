'use strict';

import type { RequestManager } from '../fetch';
import type { Gateway } from './Gateway';
import type { User, Guild, Channel } from '../struct';
import { EventEmitter } from 'events';

export interface IClient extends EventEmitter {
  api: RequestManager;
  gateway: Gateway;
  user: User | null;
  guilds: Map<string, Guild>;
  channels: Map<string, Channel>;
  users: Map<string, User>;
}