// from discos official docs
export enum PermissionsBits {
    CREATE_INSTANT_INVITE = 0x0000000000000001, // 1 << 0
    KICK_MEMBERS = 0x0000000000000002, // 1 << 1
    BAN_MEMBERS = 0x0000000000000004, // 1 << 2
    ADMINISTRATOR = 0x0000000000000008, // 1 << 3
    MANAGE_CHANNELS = 0x0000000000000010, // 1 << 4
    MANAGE_GUILD = 0x0000000000000020, // 1 << 5
    ADD_REACTIONS = 0x0000000000000040, // 1 << 6
    VIEW_AUDIT_LOG = 0x0000000000000080, // 1 << 7
    PRIORITY_SPEAKER = 0x0000000000000100, // 1 << 8
    STREAM = 0x0000000000000200, // 1 << 9
    VIEW_CHANNEL = 0x0000000000000400, // 1 << 10
    SEND_MESSAGES = 0x0000000000000800, // 1 << 11
    SEND_TTS_MESSAGES = 0x0000000000001000, // 1 << 12
    MANAGE_MESSAGES = 0x0000000000002000, // 1 << 13
    EMBED_LINKS = 0x0000000000004000, // 1 << 14
    ATTACH_FILES = 0x0000000000008000, // 1 << 15
    READ_MESSAGE_HISTORY = 0x0000000000010000, // 1 << 16
    MENTION_EVERYONE = 0x0000000000020000, // 1 << 17
    USE_EXTERNAL_EMOJIS = 0x0000000000040000, // 1 << 18
    VIEW_GUILD_INSIGHTS = 0x0000000000080000, // 1 << 19
    CONNECT = 0x0000000000100000, // 1 << 20
    SPEAK = 0x0000000000200000, // 1 << 21
    MUTE_MEMBERS = 0x0000000000400000, // 1 << 22
    DEAFEN_MEMBERS = 0x0000000000800000, // 1 << 23
    MOVE_MEMBERS = 0x0000000001000000, // 1 << 24
    USE_VAD = 0x0000000002000000, // 1 << 25
    CHANGE_NICKNAME = 0x0000000004000000, // 1 << 26
    MANAGE_NICKNAMES = 0x0000000008000000, // 1 << 27
    MANAGE_ROLES = 0x0000000010000000, // 1 << 28
    MANAGE_WEBHOOKS = 0x0000000020000000, // 1 << 29
    MANAGE_GUILD_EXPRESSIONS = 0x0000000040000000, // 1 << 30
    USE_APPLICATION_COMMANDS = 0x0000000080000000, // 1 << 31
    REQUEST_TO_SPEAK = 0x0000000100000000, // 1 << 32
    MANAGE_EVENTS = 0x0000000200000000, // 1 << 33
    MANAGE_THREADS = 0x0000000400000000, // 1 << 34
    CREATE_PUBLIC_THREADS = 0x0000000800000000, // 1 << 35
    CREATE_PRIVATE_THREADS = 0x0000001000000000, // 1 << 36
    USE_EXTERNAL_STICKERS = 0x0000002000000000, // 1 << 37
    SEND_MESSAGES_IN_THREADS = 0x0000004000000000, // 1 << 38
    USE_EMBEDDED_ACTIVITIES = 0x0000008000000000, // 1 << 39
    MODERATE_MEMBERS = 0x0000010000000000, // 1 << 40
    VIEW_CREATOR_MONETIZATION_ANALYTICS = 0x0000020000000000, // 1 << 41
    USE_SOUNDBOARD = 0x0000040000000000, // 1 << 42
    CREATE_GUILD_EXPRESSIONS = 0x0000080000000000, // 1 << 43
    CREATE_EVENTS = 0x0000100000000000, // 1 << 44
    USE_EXTERNAL_SOUNDS = 0x0000200000000000, // 1 << 45
    SEND_VOICE_MESSAGES = 0x0000400000000000, // 1 << 46
    SEND_POLLS = 0x0002000000000000, // 1 << 49
    USE_EXTERNAL_APPS = 0x0004000000000000, // 1 << 50
    PIN_MESSAGES = 0x0008000000000000, // 1 << 51
}

export class Permissions {
    public static has(permissions: bigint, permission: PermissionsBits): boolean {
        return (permissions & BigInt(permission)) === BigInt(permission);
    }

    public static add(permissions: bigint, permission: PermissionsBits): bigint {
        return permissions | BigInt(permission);
    }

    public static remove(permissions: bigint, permission: PermissionsBits): bigint {
        return permissions & ~BigInt(permission);
    }

    public static getAll(permissions: bigint): PermissionsBits[] {
        const allPermissions: PermissionsBits[] = [];
        for (const permission of Object.values(PermissionsBits)) {
            if (typeof permission === 'number' && this.has(permissions, permission)) {
                allPermissions.push(permission);
            }
        }
        return allPermissions;
    }

    public static isAdministrator(permissions: bigint): boolean {
        return this.has(permissions, PermissionsBits.ADMINISTRATOR);
    }

    public static getNames(permissions: bigint): string[] {
        return this.getAll(permissions).map(permission => PermissionsBits[permission]);
    }
}