import { serverId } from "./config.js";
import { client } from "./main.js";

const channelLookup = new Map();

async function findChannel(channelId) {
    let guilds;
    console.log("Trying to find channel id " + channelId);
    if (channelLookup.has(channelId)) {
        return channelLookup.get(channelId);
    }
    try {
        let promiseColl = await client.guilds.fetch();
        let promises = promiseColl.map((v) => v.fetch());
        guilds = await Promise.all(promises);
        console.log("Successfully grabbed all the guilds! " + guilds.length);
    } catch (e) {
        console.error(e);
        console.log("Failed!");
        return null;
    }
    for (let i = 0; i < guilds.length ; i ++) {
        let guild = guilds[0]
        console.log(`Looking for chan ${channelId} in guild ${guild.name}`)
        try {
            let chan = await guild.channels.fetch(channelId);
            if (chan) {
                console.log("Found it!");
                return chan;
            }
        } catch {}
    }
    console.log("Couldn't find it :(");
    return null;
}

async function seedChannelLookup(client) {
    let guild = await client.guilds.fetch(serverId);
    let channelColl = await guild.channels.fetch();
    let promises = channelColl.map((v) => v.fetch().catch(() => null));
    let channels = await Promise.all(promises);
    for (let i = 0; i < channels.length ; i ++) {
        if (!channels[i]) continue;
        channelLookup.set("#" + channels[i].name, channels[i]);
    }
}

export { seedChannelLookup, findChannel }