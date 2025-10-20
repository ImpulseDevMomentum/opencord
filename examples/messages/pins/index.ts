// Shows you how to pin and unpin messages using opencord
import { Client } from '../../../index';

const client = new Client({
    token: ""
});


// send a message, pin it, wait for 2 seconds, unpin it
client.on('ready', async (user) => {    

    const channel = await client.fetchChannel("");
    
    const message = await channel.send('This message will be pinned!');
    await message.pin();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await message.unpin();
        
    client.destroy();
});

// like in the reactions example, you can also listen for ceartion keywords in a message pin them
// Im just to lazy to add it here iksde

client.login();