# Commands & Interactions

Execute Discord slash commands and interactions using OpenCord.

## eCommand Class

The `eCommand` class provides methods for fetching and executing Discord application commands.

### Importing

```typescript
import { eCommand } from 'opencord';

const commands = new eCommand(client);
```

### Methods

#### `fetchCommands(guildId: string): Promise<ApplicationCommandResponse>`

Fetch all available commands in a guild.

```typescript
const commandsData = await commands.fetchCommands('GUILD_ID');
console.log(commandsData.application_commands);
```

#### `getCommands(guildId: string): Promise<CommandData[]>`

Get all commands in a guild.

```typescript
const allCommands = await commands.getCommands('GUILD_ID');
```

#### `getCommandsByApplication(guildId: string, applicationId: string): Promise<CommandData[]>`

Get commands filtered by application/bot ID.

```typescript
const botCommands = await commands.getCommandsByApplication('GUILD_ID', 'BOT_ID');
```

#### `getCommandByName(guildId: string, name: string, applicationId?: string): Promise<CommandData | null>`

Find a command by name.

```typescript
const banCommand = await commands.getCommandByName('GUILD_ID', 'ban');
const specificBotCommand = await commands.getCommandByName('GUILD_ID', 'ban', 'BOT_ID');
```

#### `execute(command: string, guildId: string, channelId: string, options?: ExecuteOptions): Promise<any>`

Execute a command. Accepts either command ID or command name.

```typescript
// Using command ID
await commands.execute('COMMAND_ID', 'GUILD_ID', 'CHANNEL_ID');

// Using command name
await commands.execute('ban', 'GUILD_ID', 'CHANNEL_ID', {
    applicationId: 'BOT_ID', // Optional: filter by bot
    options: [
        {
            type: CommandOptionType.USER,
            name: 'user',
            value: 'USER_ID'
        },
        {
            type: CommandOptionType.STRING,
            name: 'reason',
            value: 'spam'
        }
    ]
});
```

### ExecuteOptions

```typescript
interface ExecuteOptions {
    applicationId?: string;        // Filter commands by bot ID
    options?: CommandOption[];     // Command parameters
    nonce?: string;                // Custom nonce (auto-generated)
    session_id?: string;           // Session ID (auto-generated)
    analytics_location?: string;   // Analytics location (default: "slash_ui")
    authorizingValue?: string;     // Authorizing integration owner
}
```

## InteractionBuilder

Fluent API builder for creating command interactions.

### Importing

```typescript
import { InteractionBuilder } from 'opencord';
```

### Basic Usage

#### Simple Command (No Sub-commands)

```typescript
const command = new InteractionBuilder(client)
    .command('ban') // you can also use ID of the command
    .guild('GUILD_ID')
    .channel('CHANNEL_ID')
    .user('user', 'USER_ID')
    .string('reason', 'spam')
    .execute(); // you can also use .build() before .execute()
```

#### Command with Sub-command

```typescript
const command = new InteractionBuilder(client)
    .command('timeout')
    .guild('GUILD_ID')
    .channel('CHANNEL_ID')
    .subContext(InteractionBuilder.CHAT_INPUT) // If a command has a sub command, provide .subContext()
        .name('add')
        .user('user', 'USER_ID')
        .string('reason', 'testing')
        .string('duration', '10s')
        .boolean('dm', true)
    .build() // here .build() is needed. It returns to main builder
    .execute();
```

### Builder Methods

#### Configuration

- `.command(commandIdOrName: string)` - Set command ID or name
- `.guild(guildId: string)` - Set guild ID
- `.channel(channelId: string)` - Set channel ID
- `.setClient(client: IClient)` - Set client for execution
- `.withOptions(options: ExecuteOptions)` - Set execution options

#### Direct Parameters (for commands without sub-commands)

- `.string(name: string, value: string)` - Add string parameter
- `.integer(name: string, value: number)` - Add integer parameter
- `.boolean(name: string, value: boolean)` - Add boolean parameter
- `.user(name: string, userId: string)` - Add user parameter
- `.channelParam(name: string, channelId: string)` - Add channel parameter
- `.role(name: string, roleId: string)` - Add role parameter
- `.number(name: string, value: number)` - Add number parameter
- `.mentionable(name: string, value: string)` - Add mentionable parameter

#### Sub-Context (for commands with sub-commands)

- `.subContext(type: CommandType)` - Create sub-command context
  - `InteractionBuilder.USER` - User context menu
  - `InteractionBuilder.CHAT_INPUT` - Slash command with sub-command
  - `InteractionBuilder.MESSAGE` - Message context menu

Returns `SubContextBuilder` with same parameter methods as above, plus:
- `.name(name: string)` - Set sub-command name
- `.build()` - Return to main builder
- `.attachment(name: string)` - Add attachment parameter (TODO: implementation)

#### Execution

- `.build()` - Build and return builder (optional, returns `this`)
- `.execute()` - Execute the command (required)
- `.toObject()` - Get execution parameters as object

### Constants

```typescript
InteractionBuilder.USER       // User context menu
InteractionBuilder.CHAT_INPUT // Slash command sub-command
InteractionBuilder.MESSAGE    // Message context menu
```

## CommandOption Types

```typescript
enum CommandOptionType {
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
    ATTACHMENT = 11
}
```

## Examples

### Execute Simple Ban Command

```typescript
const command = new InteractionBuilder(client)
    .command('ban')
    .guild('GUILD_ID')
    .channel('CHANNEL_ID')
    .user('user', 'USER_ID')
    .string('reason', 'Spam')
    .execute();
```

### Execute Command with Sub-command

```typescript
const command = new InteractionBuilder(client)
    .command('timeout')
    .guild('GUILD_ID')
    .channel('CHANNEL_ID')
    .subContext(InteractionBuilder.CHAT_INPUT)
        .name('add')
        .user('user', 'USER_ID')
        .string('reason', 'Testing')
        .string('duration', '10s')
        .boolean('dm', true)
    .build()
    .execute();
```

### Using eCommand Directly

```typescript
const commands = new eCommand(client);

await commands.execute('ban', 'GUILD_ID', 'CHANNEL_ID', {
    options: [
        {
            type: CommandOptionType.USER,
            name: 'user',
            value: 'USER_ID'
        },
        {
            type: CommandOptionType.STRING,
            name: 'reason',
            value: 'spam'
        }
    ]
});
```

### Find Command by Name

```typescript
const commands = new eCommand(client);

const banCommand = await commands.getCommandByName('GUILD_ID', 'ban');
if (banCommand) {
    console.log(`Command ID: ${banCommand.id}`);
    console.log(`Application ID: ${banCommand.application_id}`);
}
```

## Errors

- `CommandNotFoundError` - Command not found in the guild
- `CommandMetadataNotFoundError` - Command metadata cannot be retrieved