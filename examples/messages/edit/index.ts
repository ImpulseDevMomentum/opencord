// This shows you how to edit a message using opencord
import { Client } from '../../../index';

const client = new Client({
    token: ""
});

client.login();


// listen for the messages and print them to the console, then edit the message 
client.on('messageCreate', (message) => {
    message.edit("Hello, world! (edited)");

    client.destroy();
});