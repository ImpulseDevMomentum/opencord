// Shows you how to forward messages using opencord
import { Client } from '../../../index';

const client = new Client({
    token: ""
});

client.on('ready', async (user) => {

    const channel = await client.fetchChannel("");
    const message = await channel.send('This message will be forwarded');
    
    await message.forward("");
    
    // await message.forward(user);
    
    client.destroy();
});

client.login();