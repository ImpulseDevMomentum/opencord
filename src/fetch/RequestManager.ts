'use strict';

import Bottleneck from 'bottleneck';
import { DiscordAPIError, DiscordHTTPError } from '../errors';
import { Constants } from '../util';

export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  auth?: boolean;
}

export class RequestManager {
  private token: string;
  private limiter: Bottleneck;
  private baseURL: string;

  constructor(token: string) {
    this.token = token;
    this.baseURL = Constants.API_BASE_URL;
    
    // rate limit rquests
    this.limiter = new Bottleneck({
      reservoir: 50,
      reservoirRefreshAmount: 50,
      reservoirRefreshInterval: 1000,
      maxConcurrent: 5,
      minTime: 20,
    });
  }

  public async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    return this.limiter.schedule(() => this._makeRequest(endpoint, options));
  }

  private async _makeRequest(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    const auth = options.auth !== false;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9156 Chrome/124.0.6367.243 Electron/30.0.6 Safari/537.36',
      'X-Super-Properties': Buffer.from(JSON.stringify({
        os: 'Windows',
        browser: 'Discord Client',
        release_channel: 'stable',
        client_version: '1.0.9156',
        os_version: '10.0.19045',
        os_arch: 'x64',
        app_arch: 'x64',
        system_locale: 'en-US',
        client_build_number: 314511,
        native_build_number: 49606,
        client_event_source: null,
      })).toString('base64'),
      'X-Discord-Locale': 'en-US',
      'X-Discord-Timezone': 'Europe/Warsaw',
      ...options.headers,
    };

    if (auth) {
      headers['Authorization'] = this.token;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this._makeRequest(endpoint, options);
    }

    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (data && data.code) {
        throw new DiscordAPIError(
          data.message || 'Unknown API Error',
          data.code,
          response.status,
          method,
          endpoint
        );
      }
      throw new DiscordHTTPError(
        `HTTP Error ${response.status}`,
        response.status,
        method,
        endpoint
      );
    }

    return data;
  }

  public get(endpoint: string, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  public post(endpoint: string, body: any, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  public patch(endpoint: string, body: any, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  public delete(endpoint: string, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  public put(endpoint: string, body: any, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }
}