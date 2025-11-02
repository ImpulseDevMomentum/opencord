import { Client } from '../src/client/Client';
import { eCommand } from '../src/util/useCommand';
import { InteractionBuilder } from '../src/builders/InteractionBuilder';
import { CommandOptionType, CommandType } from '../src/struct/Commands';
import { CommandNotFoundError, CommandMetadataNotFoundError, TODOError } from '../src/errors';

describe('Commands', () => {
  describe('eCommand', () => {
    let client: Client;
    let commands: eCommand;

    beforeEach(() => {
      client = new Client({ token: 'test_token' });
      commands = new eCommand(client);
    });

    afterEach(() => {
      if (client) {
        client.destroy();
      }
    });

    it('should create eCommand instance', () => {
      expect(commands).toBeInstanceOf(eCommand);
    });

    it('should have client property', () => {
      expect((commands as any).client).toBe(client);
    });
  });

  describe('InteractionBuilder', () => {
    let client: Client;

    beforeEach(() => {
      client = new Client({ token: 'test_token' });
    });

    afterEach(() => {
      if (client) {
        client.destroy();
      }
    });

    describe('Constructor', () => {
      it('should create builder without client', () => {
        const builder = new InteractionBuilder();
        expect(builder).toBeInstanceOf(InteractionBuilder);
      });

      it('should create builder with client', () => {
        const builder = new InteractionBuilder(client);
        expect(builder).toBeInstanceOf(InteractionBuilder);
      });

      it('should have static constants', () => {
        expect(InteractionBuilder.USER).toBe(CommandType.USER);
        expect(InteractionBuilder.CHAT_INPUT).toBe(CommandType.CHAT_INPUT);
        expect(InteractionBuilder.MESSAGE).toBe(CommandType.MESSAGE);
      });
    });

    describe('Configuration Methods', () => {
      let builder: InteractionBuilder;

      beforeEach(() => {
        builder = new InteractionBuilder();
      });

      it('should set command ID or name', () => {
        builder.command('ban');
        expect((builder as any).commandIdOrName).toBe('ban');
        
        builder.command('123456789012345678');
        expect((builder as any).commandIdOrName).toBe('123456789012345678');
      });

      it('should set guild ID', () => {
        builder.guild('GUILD_ID');
        expect((builder as any).guildId).toBe('GUILD_ID');
      });

      it('should set channel ID', () => {
        builder.channel('CHANNEL_ID');
        expect((builder as any).channelId).toBe('CHANNEL_ID');
      });

      it('should get channel ID', () => {
        builder.channel('CHANNEL_ID');
        expect(builder.getChannelId()).toBe('CHANNEL_ID');
      });

      it('should get client', () => {
        const builderWithClient = new InteractionBuilder(client);
        expect(builderWithClient.getClient()).toBe(client);
      });

      it('should set client', () => {
        builder.setClient(client);
        expect(builder.getClient()).toBe(client);
      });

      it('should set execution options', () => {
        builder.withOptions({
          applicationId: 'APP_ID',
          nonce: 'custom_nonce',
          session_id: 'session_id',
          analytics_location: 'custom_location',
          authorizingValue: 'authorizing_value'
        });
        expect((builder as any).executionOptions).toEqual({
          applicationId: 'APP_ID',
          nonce: 'custom_nonce',
          session_id: 'session_id',
          analytics_location: 'custom_location',
          authorizingValue: 'authorizing_value'
        });
      });
    });

    describe('Direct Parameters (No Sub-commands)', () => {
      let builder: InteractionBuilder;

      beforeEach(() => {
        builder = new InteractionBuilder();
      });

      it('should add string parameter', () => {
        builder.string('reason', 'spam');
        const options = (builder as any).options;
        expect(options).toHaveLength(1);
        expect(options[0]).toEqual({
          type: CommandOptionType.STRING,
          name: 'reason',
          value: 'spam'
        });
      });

      it('should add integer parameter', () => {
        builder.integer('count', 5);
        const options = (builder as any).options;
        expect(options[0]).toEqual({
          type: CommandOptionType.INTEGER,
          name: 'count',
          value: 5
        });
      });

      it('should add boolean parameter', () => {
        builder.boolean('enabled', true);
        const options = (builder as any).options;
        expect(options[0]).toEqual({
          type: CommandOptionType.BOOLEAN,
          name: 'enabled',
          value: true
        });
      });

      it('should add user parameter', () => {
        builder.user('user', 'USER_ID');
        const options = (builder as any).options;
        expect(options[0]).toEqual({
          type: CommandOptionType.USER,
          name: 'user',
          value: 'USER_ID'
        });
      });

      it('should add channel parameter', () => {
        builder.channelParam('channel', 'CHANNEL_ID');
        const options = (builder as any).options;
        expect(options[0]).toEqual({
          type: CommandOptionType.CHANNEL,
          name: 'channel',
          value: 'CHANNEL_ID'
        });
      });

      it('should add role parameter', () => {
        builder.role('role', 'ROLE_ID');
        const options = (builder as any).options;
        expect(options[0]).toEqual({
          type: CommandOptionType.ROLE,
          name: 'role',
          value: 'ROLE_ID'
        });
      });

      it('should add number parameter', () => {
        builder.number('amount', 10.5);
        const options = (builder as any).options;
        expect(options[0]).toEqual({
          type: CommandOptionType.NUMBER,
          name: 'amount',
          value: 10.5
        });
      });

      it('should add mentionable parameter', () => {
        builder.mentionable('target', 'TARGET_ID');
        const options = (builder as any).options;
        expect(options[0]).toEqual({
          type: CommandOptionType.MENTIONABLE,
          name: 'target',
          value: 'TARGET_ID'
        });
      });

      it('should chain multiple parameters', () => {
        builder
          .user('user', 'USER_ID')
          .string('reason', 'spam')
          .boolean('dm', true);
        
        const options = (builder as any).options;
        expect(options).toHaveLength(3);
      });
    });

    describe('Sub-Context', () => {
      let builder: InteractionBuilder;

      beforeEach(() => {
        builder = new InteractionBuilder();
      });

      it('should create sub-context with CHAT_INPUT', () => {
        const subBuilder = builder.subContext(InteractionBuilder.CHAT_INPUT);
        expect(subBuilder).toBeDefined();
        
        const options = (builder as any).options;
        expect(options).toHaveLength(1);
        expect(options[0].type).toBe(CommandOptionType.SUB_COMMAND);
      });

      it('should create sub-context with USER', () => {
        const subBuilder = builder.subContext(InteractionBuilder.USER);
        expect(subBuilder).toBeDefined();
      });

      it('should create sub-context with MESSAGE', () => {
        const subBuilder = builder.subContext(InteractionBuilder.MESSAGE);
        expect(subBuilder).toBeDefined();
      });

      it('should set sub-command name', () => {
        const subBuilder = builder.subContext(InteractionBuilder.CHAT_INPUT);
        subBuilder.name('add');
        
        const options = (builder as any).options;
        expect(options[0].name).toBe('add');
      });

      it('should add parameters to sub-command', () => {
        const subBuilder = builder.subContext(InteractionBuilder.CHAT_INPUT);
        subBuilder.name('add')
          .user('user', 'USER_ID')
          .string('reason', 'testing');
        
        const options = (builder as any).options;
        expect(options[0].options).toHaveLength(2);
        expect(options[0].options[0]).toEqual({
          type: CommandOptionType.USER,
          name: 'user',
          value: 'USER_ID'
        });
      });

      it('should return to main builder with build()', () => {
        const subBuilder = builder.subContext(InteractionBuilder.CHAT_INPUT);
        const returnedBuilder = subBuilder.build();
        
        expect(returnedBuilder).toBe(builder);
      });
    });

    describe('Build and Execute', () => {
      let builder: InteractionBuilder;

      beforeEach(() => {
        builder = new InteractionBuilder(client);
      });

      it('should build and return this', () => {
        const result = builder.build();
        expect(result).toBe(builder);
      });

      it('should return object with toObject()', () => {
        builder
          .command('ban')
          .guild('GUILD_ID')
          .channel('CHANNEL_ID')
          .user('user', 'USER_ID');
        
        const obj = builder.toObject();
        expect(obj).toEqual({
          command: 'ban',
          guildId: 'GUILD_ID',
          channelId: 'CHANNEL_ID',
          options: [
            {
              type: CommandOptionType.USER,
              name: 'user',
              value: 'USER_ID'
            }
          ],
          executionOptions: undefined
        });
      });

      it('should throw error when executing without client', async () => {
        const builderWithoutClient = new InteractionBuilder();
        builderWithoutClient
          .command('ban')
          .guild('GUILD_ID')
          .channel('CHANNEL_ID');
        
        await expect(builderWithoutClient.execute()).rejects.toThrow('Client must be set before executing');
      });

      it('should throw error when executing without command', async () => {
        builder
          .guild('GUILD_ID')
          .channel('CHANNEL_ID');
        
        await expect(builder.execute()).rejects.toThrow('Command, guild, and channel must be set before executing');
      });

      it('should throw error when executing without guild', async () => {
        builder
          .command('ban')
          .channel('CHANNEL_ID');
        
        await expect(builder.execute()).rejects.toThrow('Command, guild, and channel must be set before executing');
      });

      it('should throw error when executing without channel', async () => {
        builder
          .command('ban')
          .guild('GUILD_ID');
        
        await expect(builder.execute()).rejects.toThrow('Command, guild, and channel must be set before executing');
      });
    });

    describe('SubContextBuilder attachment', () => {
      let builder: InteractionBuilder;

      beforeEach(() => {
        builder = new InteractionBuilder();
      });

      it('should throw TODOError for attachment method', () => {
        const subBuilder = builder.subContext(InteractionBuilder.CHAT_INPUT);
        
        expect(() => {
          subBuilder.attachment();
        }).toThrow(TODOError);
      });
    });
  });
});