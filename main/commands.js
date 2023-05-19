import * as bank from '../bank.js'
import { stripUser } from '../common.js'
import { coerceInt } from '../coerce.js'
import { v4 as uuid } from 'uuid';
import fs from 'fs'
import { MessagePayload } from 'discord.js';
import * as users from '../users.js';
import { botChannel } from '../channels.js';

const noteLimit = 800

async function send(message, args) {
    if (args.length < 2) {
        return `<@${message.author.id}>: Invalid arguments provided: follow the form '@thisbot send @userToSendTo amount (optional: & some message)'`
    }
    if (!args[0].startsWith("<@") || !args[0].endsWith(">")) {
        return `<@${message.author.id}>: The recipient you specified doesn't appear to be a valid mention`
    }
    let recipient = stripUser(args[0])
    if (recipient == message.author.id)
        return `<@${message.author.id}>: Can't send money to yourself dummy`

    let amountOrError = coerceInt(args[1])
    if (!Number.isInteger(amountOrError)) {
        return amountOrError
    }
    let amount = amountOrError

    if (!await _signup(message.guild, recipient)) {
        let bc = await botChannel()
        await bc.send(_signupCongrats(recipient))
    }

    let note = args.slice(2).join(" ");
    let overflowed = note.length > noteLimit
    if (overflowed) {
        note = note.substring(0, noteLimit) + "... <Output truncated>"
    }

    let resp = bank.send(message.author.id, recipient, amount, note)
    if (resp)
        return resp

    if (overflowed) {
        let bc = botChannel()
        await bc.send(`<@${message.author.id}>: Your message was truncated to ${noteLimit} characters, this isn't a book club`)
    }
    let plural = amount > 1 ? "s" : ""
    resp = "Hey " + args[0] + "! <@" + message.author.id + "> just sent you " + amount + " coin" + plural
    if (note) {
        resp += " with the message '" + note + "'. "
    } else {
        resp += "! "
    }
    resp += "You now have a balance of " + bank.getCachedBalance(recipient)
    return resp
}

function balance(message, args) {
    let cached
    if (args.length == 0) {
        cached = bank.getCachedBalance(message.author.id)
    } else if (args.length == 1) {
        let target
        if (args[0] == "shop") {
            target = users.shop
        } else if (args[0] == "mint") {
            target = users.mint
        } else if (args[0] == "casino") {
            target = users.casino
        } else if (!args[0].startsWith("<@") || !args[0].endsWith(">")) {
            return `<@${message.author.id}>: The user you specified doesn't appear to be a valid mention`
        } else {
            target = stripUser(args[0])
        }
        cached = bank.getCachedBalance(target)
    } else {
        return `<@${message.author.id}>: Invalid arguments provided: follow the form '@thisbot balance' for your own balance or '@thisbot balance @otherUser' for someone else's`
    }

    if (cached == 0) return `<@${message.author.id}>: You're broke!`
    return `<@${message.author.id}>: ` + cached
}

async function history(message, args) {
    let target
    if (args.length == 0) {
        target = message.author.id
    } else if (args.length == 1) {
        if (args[0] == "global") {
            target = "global"
        } else if (args[0] == "shop") {
            target = users.shop
        } else if (args[0] == "mint") {
            target = users.mint
        } else if (args[0] == "casino") {
            target = users.casino
        } else if (!args[0].startsWith("<@") || !args[0].endsWith(">")) {
            return `<@${message.author.id}>: The user you specified doesn't appear to be a valid mention`
        } else {
            target = stripUser(args[0])
        }
    } else {
        return `<@${message.author.id}>: Invalid arguments provided: follow the form '@thisbot balance' for your own balance or '@thisbot balance @otherUser' for someone else's`
    }

    let filter = target == "global" ? m => true : m => m.sender == target || m.recipient == target
    let table = await bank.printLedger(message.guild, filter)
    let dir = "./tmp/" + uuid()
    let file = dir + "/history.txt"
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(file, table)
    let payload = new MessagePayload(message, { files: [file] });
    let bc = await botChannel();
    await bc.send(payload)
    return null
}

const cory = "211002777193676800"

function mint(message, args) {
    if (message.author.id == cory) {
        if (args.length < 2) {
            return "Invalid arguments provided: follow the form '@thisbot mint @person amount (optional: & some message)'"
        }
        if (!args[0].startsWith("<@") || !args[0].endsWith(">")) {
            return "The user you specified doesn't appear to be a valid mention"
        }
        let recipient = stripUser(args[0])
        let amount = Number.parseInt(args[1])
        let note = args.slice(2).join(" ");
        return bank.mint(recipient, amount, users.mint, note) ?? "✅"
    } else {
        return "Fuck off."
    }
}

async function _signup(guild, userToSignUp) {
    let user
    try {
        user = await guild.members.fetch(userToSignUp)
    } catch {

    }

    if (!user) {

        return `<@${message.author.id}>: Only natural-born Tingmenistan citizens can be signed up for the coin program`
    }
    return bank.signup(userToSignUp)
}

function _signupCongrats(userId) {
    return `Congrats <@${userId}>, you've been signed up! You've been given ${bank.signupAmount} coins as a signup bonus`
}

async function signup(message, args) {
    if (args.length == 0) {
        return await _signup(message.guild, message.author.id) ?? _signupCongrats(message.author.id)
    }
    else if (args.length == 1) {
        if (!args[0].startsWith("<@") || !args[0].endsWith(">")) {
            return `<@${message.author.id}>: The user you specified doesn't appear to be a valid mention`
        }
        return await _signup(message.guild, stripUser(args[0])) ?? _signupCongrats(stripUser(args[0]))
    }
    return `<@${message.author.id}>: Invalid arguments provided: follow the form '@thisbot signup' or '@thisbot signup @user'`
}

export { send, balance, history, mint, signup }