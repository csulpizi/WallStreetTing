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

export { stripUser, cleanWhiteSpace, now, randInt, coerceInt, isDm }