'use strict';

import type { IClient } from '../client/ClientTypes';
import { Constants } from './Constants';
import { CommandData, CommandOption, ApplicationCommandResponse, CommandOptionType, CommandType } from '../struct/Commands';
import { CommandNotFoundError, CommandMetadataNotFoundError } from '../errors';

export class eCommand {
    private client: IClient;

    constructor(client: IClient) {
        this.client = client;
    }

    public async fetchCommands(guildId: string): Promise<ApplicationCommandResponse> {
        const data = await this.client.api.get(Constants.Endpoints.GUILD_APPLICATION_COMMAND_INDEX(guildId));
        return data as ApplicationCommandResponse;
    }

    public async getCommands(guildId: string): Promise<ApplicationCommandResponse['application_commands']> {
        const response = await this.fetchCommands(guildId);
        return response.application_commands;
    }

    public async getCommandsByApplication(guildId: string, applicationId: string): Promise<ApplicationCommandResponse['application_commands']> {
        const commands = await this.getCommands(guildId);
        return commands.filter(cmd => cmd.application_id === applicationId);
    }

    public async getCommandByName(guildId: string, name: string, applicationId?: string): Promise<ApplicationCommandResponse['application_commands'][0] | null> {
        const commands = applicationId 
            ? await this.getCommandsByApplication(guildId, applicationId)
            : await this.getCommands(guildId);
        
        return commands.find(cmd => cmd.name === name) || null;
    }

    /**
     * Execute a application "interaction".
     * 
     * 
     * @param command - Command ID or command name
     * @param guildId - Guild ID where the interaction is available
     * @param channelId - Channel ID where the interaction will be executed
     * @param options - Optional execution options
     * @param options.applicationId - Optional application/bot ID to filter commands (useful when multiple bots have commands with same name)
     * @param options.options - Array of command options (parameters) to pass to the command
     * @param options.nonce - Custom nonce for the interaction (auto-generated if not provided)
     * @param options.session_id - Optional session ID for the interaction (auto-generated if not provided)
     * @param options.analytics_location - Analytics location (default: "slash_ui")
     * 
     * @returns Promise that resolves with Discord's response to the interaction
     * 
     * @throws {CommandNotFoundError} When command is not found in the guild
     * @throws {CommandMetadataNotFoundError} When command metadata cannot be retrieved
     */
    public async execute(
        command: string,
        guildId: string,
        channelId: string,
        options?: {
            applicationId?: string;
            options?: CommandOption[];
            nonce?: string;
            session_id?: string;
            analytics_location?: string;
            authorizingValue?: string;
        }
    ): Promise<any> {
        const isId = /^\d{17,19}$/.test(command);
        
        let commandId: string;
        let applicationId: string;
        let metadata: { command: ApplicationCommandResponse['application_commands'][0]; application: ApplicationCommandResponse['applications'][0] } | null;

        if (isId) {
            metadata = await this.getCommandMetadata(guildId, command);
            if (!metadata) {
                throw new CommandNotFoundError(command, guildId);
            }
            commandId = command;
            applicationId = metadata.command.application_id;
        } else {
            const commandData = await this.getCommandByName(guildId, command, options?.applicationId);
            if (!commandData) {
                throw new CommandNotFoundError(command, guildId);
            }
            commandId = commandData.id;
            applicationId = commandData.application_id;
            metadata = await this.getCommandMetadata(guildId, commandId);
            if (!metadata) {
                throw new CommandMetadataNotFoundError(command);
            }
        }

        const commandOptions = options?.options || [];
        
        const payload: any = {
            type: 2,
            application_id: applicationId,
            guild_id: guildId,
            channel_id: channelId,
            analytics_location: options?.analytics_location || 'slash_ui',
            data: {
                version: metadata.command.version,
                id: commandId,
                name: metadata.command.name,
                type: metadata.command.type,
                ...(commandOptions.length > 0 && { options: commandOptions }),
            },
            application_command: {
                ...metadata.command,
            },
            id: commandId,
            name: metadata.command.name,
            ...(commandOptions.length > 0 && { options: commandOptions }),
            nonce: options?.nonce || this.generateNonce(),
            version: metadata.command.version,
            authorizing_integration_owners: [
                {
                    type: 0,
                    value: options?.authorizingValue || ""
                }
            ],
        };

        if (options?.session_id) {
            payload.session_id = options.session_id;
        } else {
            payload.session_id = Array.from(crypto.getRandomValues(new Uint8Array(16)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }

        // payload to see what's being sent (debug commented)
        // console.log('Payload being sent:', JSON.stringify(payload, null, 2));

        const response = await this.client.api.post(Constants.Endpoints.INTERACTIONS, payload);
        return response;
    }

    public parseCommandOptions(commandData: CommandData): {
        commandName: string;
        options: Map<string, any>;
        subCommand?: string;
        subCommandGroup?: string;
    } {
        const options = new Map<string, any>();
        let subCommand: string | undefined;
        let subCommandGroup: string | undefined;

        const parseOptions = (opts: CommandOption[]): void => {
            for (const opt of opts) {
                if (opt.type === CommandOptionType.SUB_COMMAND_GROUP) {
                    subCommandGroup = opt.name;
                    if (opt.options) {
                        parseOptions(opt.options);
                    }
                } else if (opt.type === CommandOptionType.SUB_COMMAND) {
                    subCommand = opt.name;
                    if (opt.options) {
                        parseOptions(opt.options);
                    }
                } else {
                    options.set(opt.name, opt.value);
                }
            }
        };

        const commandName = commandData.data?.name || commandData.name || '';
        
        if (commandData.data?.options) {
            parseOptions(commandData.data.options);
        } else if (commandData.options) {
            parseOptions(commandData.options);
        }

        return {
            commandName,
            options,
            subCommand,
            subCommandGroup,
        };
    }

    public getOptionValue(commandData: CommandData, optionName: string): any {
        const { options } = this.parseCommandOptions(commandData);
        return options.get(optionName);
    }

    public getAllOptionValues(commandData: CommandData): Map<string, any> {
        const { options } = this.parseCommandOptions(commandData);
        return options;
    }

    public hasOption(commandData: CommandData, optionName: string): boolean {
        const { options } = this.parseCommandOptions(commandData);
        return options.has(optionName);
    }

    public async getCommandMetadata(guildId: string, commandId: string): Promise<{
        command: ApplicationCommandResponse['application_commands'][0];
        application: ApplicationCommandResponse['applications'][0];
    } | null> {
        const response = await this.fetchCommands(guildId);
        
        const command = response.application_commands.find(cmd => cmd.id === commandId);
        if (!command) return null;

        const application = response.applications.find(app => app.id === command.application_id);
        if (!application) return null;

        return { command, application };
    }

    private generateNonce(): string {
        return Date.now().toString();
    }
}
export function createCommandOption(
    type: CommandOptionType,
    name: string,
    value: string | number | boolean,
    options?: {
        required?: boolean;
        choices?: { name: string; value: string | number }[];
        min_value?: number;
        max_value?: number;
        channel_types?: number[];
        autocomplete?: boolean;
    }
): CommandOption {
    return {
        type,
        name,
        value,
        required: options?.required,
        choices: options?.choices,
        min_value: options?.min_value,
        max_value: options?.max_value,
        channel_types: options?.channel_types,
        autocomplete: options?.autocomplete,
    };
}