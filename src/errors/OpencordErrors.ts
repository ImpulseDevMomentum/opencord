import { version as packageVersion } from '../../package.json';

export class OpencordError extends Error {
    public name: string;
    public version: string = packageVersion;
    public path: string = "";

    constructor(message: string, version?: string, path?: string) {
        super(message);
        this.name = "OpencordError";
        this.version = version || packageVersion;
        this.path = path || "";
    }
}

export class EmptyTokenError extends OpencordError {
    constructor() {
        super("Token cannot be empty. Please provide a valid user token.", packageVersion, "Client");
        this.name = "EmptyTokenError";
    }
}

export class BotTokenError extends OpencordError {
    constructor() {
        super("Please provide a valid user token.", packageVersion, "Client");
        this.name = "BotTokenError";
    }
}

export class InvalidTokenError extends OpencordError {
    constructor() {
        super("Invalid token provided. The token is incorrect or has expired.", packageVersion, "Client");
        this.name = "InvalidTokenError";
    }
}

export class NitroRequiredError extends OpencordError {
    constructor() {
        super("You need Nitro to use server boosts. Your account does not have Nitro subscription.", packageVersion, "Guild");
        this.name = "NitroRequiredError";
    }
}

export class InvalidCrossPostChannelError extends OpencordError {
    constructor() {
        super("The target channel is not a announcements channel. Please provide a valid announcements channel.", packageVersion, "Message");
        this.name = "InvalidCrossPostChannelError";
    }
}

export class TODOError extends OpencordError {
    constructor() {
        super("This feature is not implemented yet. This will be added in the future.", packageVersion, "Opencord");
        this.name = "TODOError";
    }
}

export class CommandNotFoundError extends OpencordError {
    constructor(command: string, guildId: string) {
        super(`Command "${command}" not found in guild ${guildId}.`, packageVersion, "Command");
        this.name = "CommandNotFoundError";
    }
}

export class CommandMetadataNotFoundError extends OpencordError {
    constructor(command: string) {
        super(`Command metadata not found for "${command}".`, packageVersion, "Command");
        this.name = "CommandMetadataNotFoundError";
    }
}