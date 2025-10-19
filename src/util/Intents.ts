'use strict';

export class Intents {
  public static readonly GUILDS = 1 << 0;                      // (1)
  public static readonly GUILD_MEMBERS = 1 << 1;               // (2)
  public static readonly GUILD_BANS = 1 << 2;                  // (4)
  public static readonly GUILD_EMOJIS = 1 << 3;                // (8)
  public static readonly GUILD_INTEGRATIONS = 1 << 4;          // (16)
  public static readonly GUILD_WEBHOOKS = 1 << 5;              // (32)
  public static readonly GUILD_INVITES = 1 << 6;               // (64)
  public static readonly GUILD_VOICE_STATES = 1 << 7;          // (128)
  public static readonly GUILD_PRESENCES = 1 << 8;             // (256)
  public static readonly GUILD_MESSAGES = 1 << 9;              // (512)
  public static readonly GUILD_MESSAGE_REACTIONS = 1 << 10;    // (1024)
  public static readonly GUILD_MESSAGE_TYPING = 1 << 11;       // (2048)
  public static readonly DIRECT_MESSAGES = 1 << 12;            // (4096)
  public static readonly DIRECT_MESSAGE_REACTIONS = 1 << 13;   // (8192)
  public static readonly DIRECT_MESSAGE_TYPING = 1 << 14;      // (16384)
  public static readonly MESSAGE_CONTENT = 1 << 15;            // (32768)
  public static readonly GUILD_SCHEDULED_EVENTS = 1 << 16;     // (65536)
  public static readonly ALL = 0x3FFFF;                        // (262143)

  public static combine(...intents: number[]): number {
    return intents.reduce((acc, intent) => acc | intent, 0);
  }

  public static has(value: number, intent: number): boolean {
    return (value & intent) === intent;
  }
}