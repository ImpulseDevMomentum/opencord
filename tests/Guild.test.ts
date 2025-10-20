import { Guild } from '../src/struct/Guild';
import { NitroRequiredError, TODOError } from '../index';

describe('Guild', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      api: {
        get: jest.fn(),
        put: jest.fn(),
      },
      user: null
    };
  });

  it('should create guild from data', () => {
    const guild = new Guild(mockClient, {
      id: '123',
      name: 'Test Guild',
      icon: 'icon_hash',
      owner_id: '456',
      member_count: 100,
      premium_subscription_count: 5,
      premium_tier: 1,
      features: ['VERIFIED', 'PARTNERED']
    });

    expect(guild.id).toBe('123');
    expect(guild.name).toBe('Test Guild');
    expect(guild.memberCount).toBe(100);
    expect(guild.boostCount).toBe(5);
    expect(guild.boostTier).toBe(1);
  });

  it('should check if verified', () => {
    const guild = new Guild(mockClient, {
      id: '123',
      name: 'Test',
      icon: null,
      owner_id: '456',
      features: ['VERIFIED']
    });

    expect(guild.isVerified).toBe(true);
  });

  it('should check if partnered', () => {
    const guild = new Guild(mockClient, {
      id: '123',
      name: 'Test',
      icon: null,
      owner_id: '456',
      features: ['PARTNERED']
    });

    expect(guild.isPartnered).toBe(true);
  });

  it('should return boost level', () => {
    const guild = new Guild(mockClient, {
      id: '123',
      name: 'Test',
      icon: null,
      owner_id: '456',
      premium_tier: 2
    });

    expect(guild.boostLevel).toBe(2);
  });

  it('should throw NitroRequiredError when no nitro', async () => {
    const guild = new Guild(mockClient, {
      id: '123',
      name: 'Test',
      icon: null,
      owner_id: '456'
    });

    mockClient.user = { premiumType: 0 };

    await expect(guild.addBoost(1)).rejects.toThrow(NitroRequiredError);
  });

  it('should throw TODOError for buyBoost', async () => {
    const guild = new Guild(mockClient, {
      id: '123',
      name: 'Test',
      icon: null,
      owner_id: '456'
    });

    await expect(guild.buyBoost(1)).rejects.toThrow(TODOError);
  });

  it('should toString to guild name', () => {
    const guild = new Guild(mockClient, {
      id: '123',
      name: 'Test Guild',
      icon: null,
      owner_id: '456'
    });

    expect(guild.toString()).toBe('Test Guild');
  });
});