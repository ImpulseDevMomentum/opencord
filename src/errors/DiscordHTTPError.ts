'use strict';

export class DiscordHTTPError extends Error {
  public status: number;
  public method: string;
  public path: string;

  constructor(message: string, status: number, method: string, path: string) {
    super(message);
    this.name = 'DiscordHTTPError';
    this.status = status;
    this.method = method;
    this.path = path;
  }
}