# Error Handling

OpenCord provides specific error classes for different scenarios.

## Error Types

### `OpencordError`

Base error class for all OpenCord errors.

```typescript
import { OpencordError } from 'opencord';

if (error instanceof OpencordError) {
  console.log(error.name);
  console.log(error.version);
  console.log(error.path);
}
```

### `EmptyTokenError`

Thrown when token is empty.

```typescript
try {
  new Client({ token: '' });
} catch (error) {
  if (error instanceof EmptyTokenError) {
    console.error('Token cannot be empty');
  }
}
```

### `BotTokenError`

Thrown when bot token is provided instead of user token.

```typescript
try {
  new Client({ token: 'Bot MTIzNDU2...' });
} catch (error) {
  if (error instanceof BotTokenError) {
    console.error('Use user token, not bot token');
  }
}
```

### `InvalidTokenError`

Thrown when token is invalid or expired.

```typescript
client.login().catch(error => {
  if (error instanceof InvalidTokenError) {
    console.error('Token is invalid or expired');
  }
});
```

### `NitroRequiredError`

Thrown when feature requires Nitro subscription.

```typescript
try {
  await guild.addBoost(2);
} catch (error) {
  if (error instanceof NitroRequiredError) {
    console.error('You need Nitro to boost servers');
  }
}
```

### `TODOError`

Thrown when feature is not implemented yet.

```typescript
try {
  await guild.buyBoost(1);
} catch (error) {
  if (error instanceof TODOError) {
    console.error('Feature coming soon');
  }
}
```

### `DiscordAPIError`

Thrown when Discord API returns an error.

```typescript
try {
  await channel.send('message');
} catch (error) {
  if (error instanceof DiscordAPIError) {
    console.error(`API Error ${error.code}: ${error.message}`);
    console.error(`Status: ${error.status}`);
    console.error(`Method: ${error.method}`);
    console.error(`Path: ${error.path}`);
  }
}
```

### `DiscordHTTPError`

Thrown for HTTP errors without specific error codes.

```typescript
try {
  await client.fetchUser('INVALID_ID');
} catch (error) {
  if (error instanceof DiscordHTTPError) {
    console.error(`HTTP Error ${error.status}`);
  }
}
```

## Common Error Codes

| Code | Description |
|------|-------------|
| 50001 | Missing Access |
| 50006 | Cannot send empty message |
| 50007 | Cannot send messages to this user |
| 50013 | Missing Permissions |
| 50035 | Invalid Form Body |
| 40001 | Unauthorized (401) |

## Best Practices

### Always Handle Errors

```typescript
client.on('error', (error) => {
  console.error('Client error:', error);
});

client.on('messageCreate', async (message) => {
  try {
    await message.reply('Response');
  } catch (error) {
    console.error('Failed to reply:', error);
  }
});
```

### Check Error Types

```typescript
import { 
  InvalidTokenError, 
  DiscordAPIError,
  NitroRequiredError 
} from 'opencord';

try {
} catch (error) {
  if (error instanceof InvalidTokenError) {
    // Handle invalid token
  } else if (error instanceof DiscordAPIError) {
    // Handle API error
  } else if (error instanceof NitroRequiredError) {
    // Handle Nitro requirement
  } else {
    // Handle unknown error
  }
}
```

### Graceful Shutdown

```typescript
process.on('SIGINT', () => {
  console.log('Shutting down...');
  client.destroy();
  process.exit(0);
});
```