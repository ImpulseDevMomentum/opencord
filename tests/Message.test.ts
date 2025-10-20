import { Message } from '../src/struct/Message';
import { User } from '../src/struct/User';
import { Client } from '../src/client/Client';

describe('Message', () => {
  let mockClient: any;
  let mockUser: User;

  beforeEach(() => {
    mockClient = {
      api: {
        post: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
        put: jest.fn(),
        get: jest.fn(),
      }
    };

    mockUser = new User(mockClient, {
      id: '123',
      username: 'testuser',
      discriminator: '0001',
      avatar: null
    });
  });

  it('should create message from data', () => {
    const message = new Message(mockClient, {
      id: '456',
      channel_id: '789',
      author: {
        id: '123',
        username: 'testuser',
        discriminator: '0001',
        avatar: null
      },
      content: 'Test message',
      timestamp: '2025-01-01T00:00:00.000Z',
      edited_timestamp: null,
      tts: false,
      mention_everyone: false,
      mentions: [],
      attachments: [],
      embeds: [],
      type: 0
    });

    expect(message.id).toBe('456');
    expect(message.channelId).toBe('789');
    expect(message.content).toBe('Test message');
    expect(message.author).toBeInstanceOf(User);
  });

  it('should format time correctly', () => {
    const message = new Message(mockClient, {
      id: '456',
      channel_id: '789',
      author: { id: '123', username: 'test', discriminator: '0', avatar: null },
      content: 'Test',
      timestamp: '2025-01-01T12:30:45.000Z',
      edited_timestamp: null,
      tts: false,
      mention_everyone: false,
      mentions: [],
      attachments: [],
      embeds: [],
      type: 0
    });

    expect(message.time).toBeTruthy();
    expect(message.date).toBeTruthy();
  });

  it('should format date correctly', () => {
    const message = new Message(mockClient, {
      id: '456',
      channel_id: '789',
      author: { id: '123', username: 'test', discriminator: '0', avatar: null },
      content: 'Test',
      timestamp: '2025-01-01T12:30:45.000Z',
      edited_timestamp: null,
      tts: false,
      mention_everyone: false,
      mentions: [],
      attachments: [],
      embeds: [],
      type: 0
    });

    expect(typeof message.date).toBe('string');
  });
});