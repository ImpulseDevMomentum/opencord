import { User } from '../src/struct/User';

describe('User', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      api: {
        get: jest.fn(),
        post: jest.fn(),
      }
    };
  });

  it('should create user from data', () => {
    const user = new User(mockClient, {
      id: '123456',
      username: 'testuser',
      discriminator: '0001',
      avatar: 'avatar_hash'
    });

    expect(user.id).toBe('123456');
    expect(user.username).toBe('testuser');
    expect(user.discriminator).toBe('0001');
    expect(user.avatar).toBe('avatar_hash');
  });

  it('should format tag correctly', () => {
    const user = new User(mockClient, {
      id: '123',
      username: 'testuser',
      discriminator: '0001',
      avatar: null
    });

    expect(user.tag).toBe('0001');
  });

  it('should return displayName', () => {
    const userWithGlobal = new User(mockClient, {
      id: '123',
      username: 'testuser',
      discriminator: '0',
      avatar: null,
      global_name: 'Global Name'
    });

    expect(userWithGlobal.displayName).toBe('Global Name');

    const userWithoutGlobal = new User(mockClient, {
      id: '123',
      username: 'testuser',
      discriminator: '0001',
      avatar: null
    });

    expect(userWithoutGlobal.displayName).toBe('testuser');
  });

  it('should generate avatar URL', () => {
    const user = new User(mockClient, {
      id: '123',
      username: 'test',
      discriminator: '0',
      avatar: 'abc123'
    });

    const url = user.avatarURL(256);
    expect(url).toContain('https://cdn.discordapp.com/avatars/123/abc123.png?size=256');
  });

  it('should return null for avatar URL when no avatar', () => {
    const user = new User(mockClient, {
      id: '123',
      username: 'test',
      discriminator: '0',
      avatar: null
    });

    expect(user.avatarURL()).toBeNull();
  });

  it('should detect animated avatar', () => {
    const user = new User(mockClient, {
      id: '123',
      username: 'test',
      discriminator: '0',
      avatar: 'a_abc123'
    });

    const url = user.avatarURL();
    expect(url).toContain('.gif');
  });

  it('should generate banner URL', () => {
    const user = new User(mockClient, {
      id: '123',
      username: 'test',
      discriminator: '0',
      avatar: null,
      banner: 'banner_hash'
    });

    const url = user.bannerURL();
    expect(url).toContain('https://cdn.discordapp.com/banners/123/banner_hash.png');
  });

  it('should toString to mention format', () => {
    const user = new User(mockClient, {
      id: '123',
      username: 'test',
      discriminator: '0',
      avatar: null
    });

    expect(user.toString()).toBe('<@123>');
  });
});