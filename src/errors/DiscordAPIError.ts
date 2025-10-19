'use strict';

export class DiscordAPIError extends Error {
  public code: number;
  public status: number;
  public method: string;
  public path: string;

  constructor(message: string, code: number, status: number, method: string, path: string) {
    super(message);
    this.name = 'DiscordAPIError';
    this.code = code;
    this.status = status;
    this.method = method;
    this.path = path;
  }
}