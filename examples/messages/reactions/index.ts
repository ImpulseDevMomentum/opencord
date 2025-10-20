// Shows you how to add and remove reactions using opencord
import { Client } from '../../../index';

const client = new Client({
    token: ""
});

client.on('ready', async (user) => {    

    const channel = await client.fetchChannel("");
    const message = await channel.send('React to this message!');
    
    await message.react('👍');
    await message.react('❤️');
    await message.react('😂');
    
    // You can also get users who reacted to a message by ceration reaction or get all reactions on a message
    // const users = await message.getReactions('👍');

    // all reactions
    // const reactions = await message.getReactions();
    
    await message.unreact('👍');
    
    client.destroy();
});


// you can also listen for ceartion keywords in a message and a reaction to them
client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase().includes('react')) {
        await message.react('✅');
    }
});

client.login();