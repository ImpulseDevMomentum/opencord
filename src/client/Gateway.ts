'use strict';

import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { Constants } from '../util';
import { InvalidTokenError } from '../errors';

export interface GatewayOptions {
  token: string;
  intents?: number;
}

export class Gateway extends EventEmitter {
  private ws: WebSocket | null = null;
  private token: string;
  private sessionId: string | null = null;
  private sequence: number | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatAck: boolean = true;
  private resumeGatewayUrl: string | null = null;

  constructor(options: GatewayOptions) {
    super();
    this.token = options.token;
  }

  public async connect(gatewayUrl?: string): Promise<void> {
    const url = gatewayUrl || 'wss://gateway.discord.gg';
    const wsUrl = `${url}/?v=${Constants.GATEWAY_VERSION}&encoding=${Constants.GATEWAY_ENCODING}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.on('open', () => {
      this.emit('debug', 'WebSocket connection opened');
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      this.handleMessage(data);
    });

    this.ws.on('close', (code: number, reason: string) => {
      this.emit('debug', `WebSocket closed: ${code} - ${reason}`);
      this.cleanup();

      if (code === 4004) {
        this.emit('error', new InvalidTokenError());
        return;
      }

      if (code !== 1000) {
        setTimeout(() => {
          if (this.sessionId) {
            this.resume();
          } else {
            this.connect();
          }
        }, 5000);
      }
    });

    this.ws.on('error', (error: Error) => {
      this.emit('error', error);
    });
  }

  private handleMessage(data: WebSocket.Data): void {
    const payload = JSON.parse(data.toString());
    const { op, d, s, t } = payload;

    if (s) {
      this.sequence = s;
    }

    switch (op) {
      case Constants.OPCodes.HELLO:
        this.handleHello(d);
        break;

      case Constants.OPCodes.HEARTBEAT_ACK:
        this.heartbeatAck = true;
        this.emit('debug', 'Received heartbeat ACK');
        break;

      case Constants.OPCodes.DISPATCH:
        this.handleDispatch(t, d);
        break;

      case Constants.OPCodes.RECONNECT:
        this.emit('debug', 'Server requested reconnect');
        this.resume();
        break;

      case Constants.OPCodes.INVALID_SESSION:
        this.emit('debug', 'Invalid session');
        this.sessionId = null;
        this.sequence = null;
        setTimeout(() => this.identify(), 5000);
        break;

      default:
        this.emit('debug', `Unknown opcode: ${op}`);
    }
  }

  private handleHello(data: any): void {
    const { heartbeat_interval } = data;
    this.startHeartbeat(heartbeat_interval);

    if (this.sessionId) {
      this.resume();
    } else {
      this.identify();
    }
  }

  private startHeartbeat(interval: number): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (!this.heartbeatAck) {
        this.emit('debug', 'Heartbeat ACK not received, reconnecting...');
        this.ws?.close();
        return;
      }

      this.heartbeatAck = false;
      this.send({
        op: Constants.OPCodes.HEARTBEAT,
        d: this.sequence,
      });
      this.emit('debug', 'Sent heartbeat');
    }, interval);

    this.send({
      op: Constants.OPCodes.HEARTBEAT,
      d: this.sequence,
    });
  }

  private identify(): void {
    this.send({
      op: Constants.OPCodes.IDENTIFY,
      d: {
        token: this.token,
        capabilities: 8189,
        properties: {
          os: 'Windows',
          browser: 'Discord Client',
          release_channel: 'stable',
          client_version: '1.0.9156',
          os_version: '10.0.19045',
          os_arch: 'x64',
          app_arch: 'x64',
          system_locale: 'en-US',
          browser_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9156 Chrome/124.0.6367.243 Electron/30.0.6 Safari/537.36',
          browser_version: '30.0.6',
          client_build_number: 314511,
          native_build_number: 49606,
          client_event_source: null,
        },
        presence: {
          status: 'online',
          since: 0,
          activities: [],
          afk: false,
        },
        compress: false,
        client_state: {
          guild_versions: {},
        },
      },
    });
    this.emit('debug', 'Sent IDENTIFY');
  }

  private resume(): void {
    if (!this.sessionId || !this.sequence) {
      this.identify();
      return;
    }

    this.send({
      op: Constants.OPCodes.RESUME,
      d: {
        token: this.token,
        session_id: this.sessionId,
        seq: this.sequence,
      },
    });
    this.emit('debug', 'Sent RESUME');
  }

  private handleDispatch(eventName: string, data: any): void {
    switch (eventName) {
      case 'READY':
        this.sessionId = data.session_id;
        this.resumeGatewayUrl = data.resume_gateway_url;
        this.emit('debug', `Ready as ${data.user.username}#${data.user.discriminator}`);
        break;

      case 'RESUMED':
        this.emit('debug', 'Session resumed');
        break;
    }

    this.emit('raw', { event: eventName, data });
    this.emit(eventName, data);
  }

  private send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public disconnect(): void {
    this.cleanup();
    if (this.ws) {
      this.ws.close(1000);
      this.ws = null;
    }
    this.sessionId = null;
    this.sequence = null;
  }

  public updatePresence(status: string, activity?: any): void {
    this.send({
      op: Constants.OPCodes.PRESENCE_UPDATE,
      d: {
        since: null,
        activities: activity ? [activity] : [],
        status,
        afk: false,
      },
    });
  }
}