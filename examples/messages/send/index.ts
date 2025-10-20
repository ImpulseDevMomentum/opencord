// This shows you how to send, edit and delete a message
import { Client } from '../../../index';

const client = new Client({
    token: ""
});


// send a message, then edit it, wait for 5 seconds, delete it
client.on('ready', async (user) => {
    
    const channel = await client.fetchChannel("");
    
    const message = await channel.send('message');
    await message.edit('edited message');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    await message.delete();
    
    client.destroy();
});

client.login();