'use strict';

import type { IClient } from '../client/ClientTypes';

export class Base {
  public readonly client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }
}