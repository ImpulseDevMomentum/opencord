import { Intents } from '../src/util/Intents';

describe('Intents', () => {
  it('should have all intent values', () => {
    expect(Intents.GUILDS).toBe(1 << 0);
    expect(Intents.GUILD_MEMBERS).toBe(1 << 1);
    expect(Intents.GUILD_MESSAGES).toBe(1 << 9);
    expect(Intents.DIRECT_MESSAGES).toBe(1 << 12);
    expect(Intents.MESSAGE_CONTENT).toBe(1 << 15);
  });

  it('should combine intents correctly', () => {
    const combined = Intents.combine(
      Intents.GUILDS,
      Intents.GUILD_MESSAGES,
      Intents.MESSAGE_CONTENT
    );
    
    expect(combined).toBe(Intents.GUILDS | Intents.GUILD_MESSAGES | Intents.MESSAGE_CONTENT);
  });

  it('should check if intent is present', () => {
    const combined = Intents.combine(Intents.GUILDS, Intents.GUILD_MESSAGES);
    
    expect(Intents.has(combined, Intents.GUILDS)).toBe(true);
    expect(Intents.has(combined, Intents.GUILD_MESSAGES)).toBe(true);
    expect(Intents.has(combined, Intents.MESSAGE_CONTENT)).toBe(false);
  });

  it('ALL should include all intents', () => {
    expect(Intents.ALL).toBe(0x3FFFF);
  });
});