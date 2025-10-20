import { 
  OpencordError, 
  EmptyTokenError, 
  BotTokenError, 
  InvalidTokenError,
  NitroRequiredError,
  TODOError
} from '../index';

describe('Errors', () => {
  describe('OpencordError', () => {
    it('should create error with message', () => {
      const error = new OpencordError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('OpencordError');
      expect(error.version).toBe('infdev');
    });
  });

  describe('EmptyTokenError', () => {
    it('should have correct properties', () => {
      const error = new EmptyTokenError();
      expect(error.name).toBe('EmptyTokenError');
      expect(error.message).toContain('Token cannot be empty');
    });
  });

  describe('BotTokenError', () => {
    it('should have correct properties', () => {
      const error = new BotTokenError();
      expect(error.name).toBe('BotTokenError');
      expect(error.message).toContain('valid user token');
    });
  });

  describe('InvalidTokenError', () => {
    it('should have correct properties', () => {
      const error = new InvalidTokenError();
      expect(error.name).toBe('InvalidTokenError');
      expect(error.message).toContain('Invalid token');
    });
  });

  describe('NitroRequiredError', () => {
    it('should have correct properties', () => {
      const error = new NitroRequiredError();
      expect(error.name).toBe('NitroRequiredError');
      expect(error.message).toContain('Nitro');
    });
  });

  describe('TODOError', () => {
    it('should have correct properties', () => {
      const error = new TODOError();
      expect(error.name).toBe('TODOError');
      expect(error.message).toContain('not implemented yet');
    });
  });
});