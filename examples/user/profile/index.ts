import { Client } from '../../../index';

const client = new Client({
    token: ""
});

client.on('ready', async () => {    
    const targetUser = await client.fetchUser("");
    
    // main profile data
    // await targetUser.fetchProfile(""); // optional guild member profile (its a thing when you want to fetch users guild profile)
    // so if they have nitro for example and differnet avatars, bios etc in the guild, you can fetch that too
    
    // console.log(`Username: ${targetUser.username}`);
    // console.log(`Display Name: ${targetUser.displayName}`);
    // console.log(`Tag: ${targetUser.tag}`);
    // console.log(`Bio: ${targetUser.bio || 'None'}`);
    // console.log(`Legacy Username: ${targetUser.legacyUsername || 'None'}`);
    // console.log(`Premium Type: ${targetUser.premiumType}`);
    // console.log(`Banner Color: ${targetUser.bannerColor || 'None'}`);
    // console.log(`Accent Color: ${targetUser.accentColor || 'None'}`);
    

    // get bio
    // console.log(`Bio: ${await targetUser.getBio()}`);
    
    // iterate through badges
    // if (targetUser.badges.length > 0) {
    //     console.log('Badges:');
    //     targetUser.badges.forEach(badge => {
    //         console.log(`  - ${badge.id}: ${badge.description}`);
    //     });
    // }
    

    // Guild member profile ig
    // if (targetUser.guildMember) {
    //     console.log(`Joined: ${targetUser.guildMember.joined_at}`);
    //     console.log(`Nick: ${targetUser.guildMember.nick || 'None'}`);
    //     console.log(`Roles: ${targetUser.guildMember.roles.length}`);
    //     console.log(`Bio: ${targetUser.guildMember.bio || 'None'}`);
    // }

    // banner url
    // if (targetUser.bannerURL()) {
    //     console.log(`${targetUser.bannerURL()}`);
    // }
    
    client.destroy();

});

client.login();