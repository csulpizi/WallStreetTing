import { DMChannel } from "discord.js";
import { FuckOff, InvalidNumber } from "./errors.js";
import { client } from "./main.js";

function stripUser(text) {
    return text.trim().replaceAll("<@", "").replaceAll(">", "")
}

function cleanWhiteSpace(text) {
    return text.toLowerCase().trim().replaceAll(/   */g, " ")
}

function now() {
    return new Date(Date.now()).toLocaleString('en-gb', {timeZone: 'America/Toronto'}) + " EST"
}

function randInt(max) {
    return Math.floor(Math.random() * max);
  }

function coerceInt(x) {
    if (x.match(/[^0-9]/))
        throw new InvalidNumber()
    
    if (x.length >= 6)
        throw new FuckOff()
    
    let amount = Number.parseInt(x)
    if (Number.isNaN(amount))
        throw new InvalidNumber()
    
    return amount
}

function isDm(message) {
    return message.channel instanceof DMChannel
}

async function findChannel(channelId) {
    let guilds;
    console.log("Trying to find channel id " + channelId);
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

export { stripUser, cleanWhiteSpace, now, randInt, coerceInt, isDm, findChannel }