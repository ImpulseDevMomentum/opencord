import { Client } from '../src/client/Client';
import { EmptyTokenError, BotTokenError } from '../src/errors';

describe('Client', () => {
  describe('Constructor', () => {
    it('should throw EmptyTokenError when token is empty', () => {
      expect(() => {
        new Client({ token: '' });
      }).toThrow(EmptyTokenError);
    });

    it('should throw BotTokenError when token starts with "Bot "', () => {
      expect(() => {
        new Client({ token: 'Bot MTIzNDU2Nzg5' });
      }).toThrow(BotTokenError);
    });

    it('should create client with valid token', () => {
      const client = new Client({ token: 'valid_token_here' });
      expect(client.token).toBe('valid_token_here');
      expect(client.guilds).toBeInstanceOf(Map);
      expect(client.channels).toBeInstanceOf(Map);
      expect(client.users).toBeInstanceOf(Map);
    });
  });

  describe('Methods', () => {
    let client: Client;

    beforeEach(() => {
      client = new Client({ token: 'test_token' });
    });

    afterEach(() => {
      if (client) {
        client.destroy();
      }
    });

    it('should have api manager', () => {
      expect(client.api).toBeDefined();
    });

    it('should have gateway', () => {
      expect(client.gateway).toBeDefined();
    });
  });
});