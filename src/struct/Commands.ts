'use strict';

export enum CommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
}

export enum CommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

export interface CommandOptionChoice {
    name: string;
    value: string | number;
    name_localized?: string;
}

export interface CommandOption {
    type: CommandOptionType;
    name: string;
    description?: string;
    description_localized?: string;
    required?: boolean;
    options?: CommandOption[];
    choices?: CommandOptionChoice[];
    value?: string | number | boolean;
    min_value?: number;
    max_value?: number;
    channel_types?: number[];
    autocomplete?: boolean;
}

export interface CommandData {
    type: CommandType; 
    application_id: string;
    guild_id?: string;
    channel_id?: string;
    analytics_location?: string;
    data?: {
        version: string;
        id: string;
        name: string;
        type: number;
        options?: CommandOption[];
    };
    application_command?: {
        id: string;
        type: number;
        application_id: string;
        version: string;
        name: string;
        name_localized?: string;
        description?: string;
        description_localized?: string;
        options?: CommandOption[];
        default_member_permissions?: string | null;
        dm_permission?: boolean;
        integration_types?: number[];
        global_popularity_rank?: number;
        guild_id?: string;
    };
    attachments?: any[];
    id?: string;
    name?: string;
    options?: CommandOption[];
    session_id?: string;
    nonce?: string;
    version?: string;
}

export interface ApplicationCommandResponse {
    applications: Array<{
        id: string;
        name: string;
        description?: string;
        icon?: string;
        bot_id: string;
        flags: string;
    }>;
    application_commands: Array<{
        id: string;
        type: number;
        application_id: string;
        version: string;
        name: string;
        name_localized?: string;
        description?: string;
        description_localized?: string;
        options?: CommandOption[];
        default_member_permissions?: string | null;
        dm_permission?: boolean;
        integration_types?: number[];
        global_popularity_rank?: number;
        guild_id?: string;
    }>;
    version: string;
}