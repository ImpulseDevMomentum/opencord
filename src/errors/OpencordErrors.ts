export class OpencordError extends Error {
    public name: string;
    public version: string = "infdev";
    public path: string = "";

    constructor(message: string, version?: string, path?: string) {
        super(message);
        this.name = "OpencordError";
        this.version = version || "infdev";
        this.path = path || "";
    }
}

export class EmptyTokenError extends OpencordError {
    constructor() {
        super("Token cannot be empty. Please provide a valid user token.", "infdev", "Client");
        this.name = "EmptyTokenError";
    }
}

export class BotTokenError extends OpencordError {
    constructor() {
        super("Please provide a valid user token.", "infdev", "Client");
        this.name = "BotTokenError";
    }
}

export class InvalidTokenError extends OpencordError {
    constructor() {
        super("Invalid token provided. The token is incorrect or has expired.", "infdev", "Client");
        this.name = "InvalidTokenError";
    }
}

export class NitroRequiredError extends OpencordError {
    constructor() {
        super("You need Nitro to use server boosts. Your account does not have Nitro subscription.", "infdev", "Guild");
        this.name = "NitroRequiredError";
    }
}

export class TODOError extends OpencordError {
    constructor() {
        super("This feature is not implemented yet. This will be added in the future.", "infdev", "Opencord");
        this.name = "TODOError";
    }
}