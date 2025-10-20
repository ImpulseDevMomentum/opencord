// Shows how to get guild info and boost a server
import { Client } from '../../../index';

const client = new Client({
    token: ""
});

client.on('ready', async (user) => {   

    const guild = await client.fetchGuild("");
    
    console.log(`Name: ${guild.name}`);
    console.log(`Description: ${guild.description || 'None'}`);
    console.log(`Members: ${guild.memberCount || 'Unknown'}`);
    console.log(`Online: ${guild.onlineCount || 'Unknown'}`);
    console.log(`Boost Level: ${guild.boostLevel}`);
    console.log(`Total Boosts: ${guild.totalBoosts}`);
    console.log(`Tag: ${guild.tag || 'None'}`);
    
    console.log(`Verified: ${guild.isVerified ? 'Yes' : 'No'}`);
    console.log(`Partnered: ${guild.isPartnered ? 'Yes' : 'No'}`);
    console.log(`Discoverable: ${guild.isDiscoverable ? 'Yes' : 'No'}`);
    console.log(`Has Vanity URL: ${guild.hasVanityURL ? 'Yes' : 'No'}`);
    
    if (guild.features.length > 0) {
        console.log(`All Features: ${guild.features.join(', ')}`);
    }
    
    if (guild.bannerURL()) {
        console.log(`Banner: ${guild.bannerURL()}`);
    }

    client.destroy();
});

client.login();