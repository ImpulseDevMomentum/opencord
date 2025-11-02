'use strict';

import type { IClient } from '../client/ClientTypes';
import { eCommand } from '../util/useCommand';
import { CommandOption, CommandOptionType, CommandType } from '../struct/Commands';
import { TODOError } from '../errors';

export class InteractionBuilder {
    public static readonly USER = CommandType.USER;
    public static readonly CHAT_INPUT = CommandType.CHAT_INPUT;
    public static readonly MESSAGE = CommandType.MESSAGE;

    private commandIdOrName: string = '';
    private guildId: string = '';
    private channelId: string = '';
    private options: CommandOption[] = [];
    private client?: IClient;
    private subContextBuilders: SubContextBuilder[] = [];
    private executionOptions?: {
        applicationId?: string;
        nonce?: string;
        session_id?: string;
        analytics_location?: string;
        authorizingValue?: string;
    };

    /**
     * Create a new InteractionBuilder instance
     * @param client - Optional client instance for direct execution
     */
    constructor(client?: IClient) {
        this.client = client;
    }

    /**
     * Set the command ID or name
     */
    public command(commandIdOrName: string): this {
        this.commandIdOrName = commandIdOrName;
        return this;
    }

    /**
     * Set the guild ID
     */
    public guild(guildId: string): this {
        this.guildId = guildId;
        return this;
    }

    /**
     * Set the channel ID
     */
    public channel(channelId: string): this {
        this.channelId = channelId;
        return this;
    }

    /**
     * Get the current channel ID
     */
    public getChannelId(): string | undefined {
        return this.channelId;
    }

    /**
     * Get the current client instance
     */
    public getClient(): IClient | undefined {
        return this.client;
    }

    /**
     * Add sub-context for interaction context
     * 
     * Available contexts:
     * - `InteractionBuilder.USER` or `CommandType.USER` - User context menu
     * - `InteractionBuilder.CHAT_INPUT` or `CommandType.CHAT_INPUT` - Slash command with sub-command structure
     * - `InteractionBuilder.MESSAGE` or `CommandType.MESSAGE` - Message context menu
     * 
     * @param type - The interaction context type (use InteractionBuilder.USER, InteractionBuilder.CHAT_INPUT, or InteractionBuilder.MESSAGE)
     * 
     */
    public subContext(type: CommandType.USER | CommandType.CHAT_INPUT | CommandType.MESSAGE): SubContextBuilder {
        // All context types create a sub-command structure for slash commands
        // the type parameter is for documentation/clarity, but we ALWAYS create SUB_COMMAND
        const subCommand: CommandOption = {
            type: CommandOptionType.SUB_COMMAND,
            name: '',
            options: [],
        };
        this.options.push(subCommand);
        const builder = new SubContextBuilder(subCommand, this);
        this.subContextBuilders.push(builder);
        return builder;
    }

    /**
     * Set execution options
     */
    public withOptions(options: {
        applicationId?: string;
        nonce?: string;
        session_id?: string;
        analytics_location?: string;
        authorizingValue?: string;
    }): this {
        this.executionOptions = { ...this.executionOptions, ...options };
        return this;
    }

    /**
     * Set the client for direct execution
     */
    public setClient(client: IClient): this {
        this.client = client;
        return this;
    }

    /**
     * Add a string parameter
     * 
     * @param name - The parameter name
     * @param value - The string value
     */
    public string(name: string, value: string): this {
        this.options.push({
            type: CommandOptionType.STRING,
            name,
            value,
        });
        return this;
    }

    /**
     * Add an integer parameter
     * 
     * @param name - The parameter name
     * @param value - The integer value
     */
    public integer(name: string, value: number): this {
        this.options.push({
            type: CommandOptionType.INTEGER,
            name,
            value,
        });
        return this;
    }

    /**
     * Add a boolean parameter
     * 
     * @param name - The parameter name
     * @param value - The boolean value
     */
    public boolean(name: string, value: boolean): this {
        this.options.push({
            type: CommandOptionType.BOOLEAN,
            name,
            value,
        });
        return this;
    }

    /**
     * Add a user parameter
     * 
     * @param name - The parameter name (e.g., "user", "target")
     * @param userId - The user ID (Discord snowflake)
     */
    public user(name: string, userId: string): this {
        this.options.push({
            type: CommandOptionType.USER,
            name,
            value: userId,
        });
        return this;
    }

    /**
     * Add a channel parameter
     * 
     * @param name - The parameter name
     * @param channelId - The channel ID (Discord snowflake)
     */
    public channelParam(name: string, channelId: string): this {
        this.options.push({
            type: CommandOptionType.CHANNEL,
            name,
            value: channelId,
        });
        return this;
    }

    /**
     * Add a role parameter
     * 
     * @param name - The parameter name
     * @param roleId - The role ID (Discord snowflake)
     */
    public role(name: string, roleId: string): this {
        this.options.push({
            type: CommandOptionType.ROLE,
            name,
            value: roleId,
        });
        return this;
    }

    /**
     * Add a number parameter
     * 
     * @param name - The parameter name
     * @param value - The number value
     */
    public number(name: string, value: number): this {
        this.options.push({
            type: CommandOptionType.NUMBER,
            name,
            value,
        });
        return this;
    }

    /**
     * Add a mentionable parameter
     * 
     * @param name - The parameter name
     * @param value - The user or role ID (Discord snowflake)
     */
    public mentionable(name: string, value: string): this {
        this.options.push({
            type: CommandOptionType.MENTIONABLE,
            name,
            value,
        });
        return this;
    }

    /**
     * Build and return options array
     */
    public buildOptions(): CommandOption[] {
        return this.options;
    }

    /**
     * Build and return the builder (for chaining with execute())
     */
    public build(): this {
        return this;
    }

    /**
     * Get execution parameters as object (for use with commands.execute())
     */
    public toObject(): {
        command: string;
        guildId: string;
        channelId: string;
        options?: CommandOption[];
        executionOptions?: {
            applicationId?: string;
            nonce?: string;
            session_id?: string;
            analytics_location?: string;
            authorizingValue?: string;
        };
    } {
        return {
            command: this.commandIdOrName,
            guildId: this.guildId,
            channelId: this.channelId,
            options: this.options.length > 0 ? this.options : undefined,
            executionOptions: this.executionOptions,
        };
    }

    /**
     * Build and execute the command (REQURIES client to be set)
     */
    public async execute(): Promise<any> {
        if (!this.client) {
            throw new Error('Client must be set before executing');
        }
        if (!this.commandIdOrName || !this.guildId || !this.channelId) {
            throw new Error('Command, guild, and channel must be set before executing');
        }

        const commandHelper = new eCommand(this.client);
        return commandHelper.execute(
            this.commandIdOrName,
            this.guildId,
            this.channelId,
            {
                ...this.executionOptions,
                options: this.options.length > 0 ? this.options : undefined,
            }
        );
    }

    /**
     * Create a new InteractionBuilder instance
     * @param client - Optional client instance for direct execution
     */
    public static create(client?: IClient): InteractionBuilder {
        return new InteractionBuilder(client);
    }
}

class SubContextBuilder {
    private subCommand: CommandOption;
    private parent: InteractionBuilder;

    constructor(subCommand: CommandOption, parent: InteractionBuilder) {
        this.subCommand = subCommand;
        this.parent = parent;
    }

    /**
     * Set the name of the sub-command
     */
    public name(name: string): this {
        this.subCommand.name = name;
        return this;
    }

    /**
     * Add a string parameter to the sub-command
     * 
     * @param name - The parameter name (e.g., "msg", "reason", "text")
     * @param value - The string value
     */
    public string(name: string, value: string): this {
        if (!this.subCommand.options) this.subCommand.options = [];
        this.subCommand.options.push({
            type: CommandOptionType.STRING,
            name,
            value,
        });
        return this;
    }

    /**
     * Add an integer parameter to the sub-command
     * 
     * @param name - The parameter name (e.g., "count", "number", "amount")
     * @param value - The integer value
     */
    public integer(name: string, value: number): this {
        if (!this.subCommand.options) this.subCommand.options = [];
        this.subCommand.options.push({
            type: CommandOptionType.INTEGER,
            name,
            value,
        });
        return this;
    }

    /**
     * Add a boolean parameter to the sub-command
     * 
     * @param name - The parameter name (e.g., "enabled", "active", "public")
     * @param value - The boolean value
     */
    public boolean(name: string, value: boolean): this {
        if (!this.subCommand.options) this.subCommand.options = [];
        this.subCommand.options.push({
            type: CommandOptionType.BOOLEAN,
            name,
            value,
        });
        return this;
    }

    /**
     * Add a user parameter to the sub-command
     * 
     * @param name - The parameter name (e.g., "user", "target")
     * @param userId - The user ID (Discord snowflake)
     */
    public user(name: string, userId: string): this {
        if (!this.subCommand.options) this.subCommand.options = [];
        this.subCommand.options.push({
            type: CommandOptionType.USER,
            name,
            value: userId,
        });
        return this;
    }

    /**
     * Add a channel parameter to the sub-command
     * 
     * @param name - The parameter name (e.g., "channel", "target_channel")
     * @param channelId - The channel ID (Discord snowflake)
     */
    public channel(name: string, channelId: string): this {
        if (!this.subCommand.options) this.subCommand.options = [];
        this.subCommand.options.push({
            type: CommandOptionType.CHANNEL,
            name,
            value: channelId,
        });
        return this;
    }

    /**
     * Add a role parameter to the sub-command
     * 
     * @param name - The parameter name (e.g., "role", "target_role")
     * @param roleId - The role ID (Discord snowflake)
     */
    public role(name: string, roleId: string): this {
        if (!this.subCommand.options) this.subCommand.options = [];
        this.subCommand.options.push({
            type: CommandOptionType.ROLE,
            name,
            value: roleId,
        });
        return this;
    }

    /**
     * Add a number parameter to the sub-command
     * 
     * @param name - The parameter name (e.g., "value", "price", "rate")
     * @param value - The number value (float/decimal)
     */
    public number(name: string, value: number): this {
        if (!this.subCommand.options) this.subCommand.options = [];
        this.subCommand.options.push({
            type: CommandOptionType.NUMBER,
            name,
            value,
        });
        return this;
    }

    /**
     * Add a mentionable parameter to the sub-command (user or role)
     * 
     * @param name - The parameter name (e.g., "target", "mention")
     * @param value - The user or role ID (Discord snowflake)
     */
    public mentionable(name: string, value: string): this {
        if (!this.subCommand.options) this.subCommand.options = [];
        this.subCommand.options.push({
            type: CommandOptionType.MENTIONABLE,
            name,
            value,
        });
        return this;
    }

    /**
     * Alias for .user("user", userId) - convenient for common use case
     * 
     * @param userId - The user ID (Discord snowflake)
     */
    public value(userId: string): this {
        return this.user('user', userId);
    }

    /**
     * Add an attachment to the sub-command
     * 
     * @throws {TODOError} - This method is not implemented yet
     */
    public attachment(): this {
        throw new TODOError();
    }

    /**
     * Return to parent builder
     */
    public build(): InteractionBuilder {
        return this.parent;
    }
}