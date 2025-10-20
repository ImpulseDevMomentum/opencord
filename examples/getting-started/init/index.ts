// Once you inistialize the client, you can start using opencord to interact with the Discord API
import { Client } from '../../../index';

const client = new Client({
    token: ""
});

client.login();


// this is the first example of the opencord, you can listen for the messages and print them to the console
client.on('messageCreate', (message) => {
    console.log(`${message.author.username} ${message.date}: ${message.content}`);
});