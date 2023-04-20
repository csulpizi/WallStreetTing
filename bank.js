import fs from 'fs';
import * as yaml from 'yaml'
import * as table from 'table'
import { now } from './common.js'
import * as users from './users.js';

const ledgerFile = "./ledger.yaml"
const signupFile = "./signup.txt"
const signupAmount = 17

var bank
var locks = new Set()

function writeTransaction(sender, recipient, amount, message) {
    let ts = now()
    fs.appendFileSync(ledgerFile, yaml.stringify([{sender, recipient, amount, ts, message}]))
}

function getLedger() {
    return yaml.parse(fs.readFileSync(ledgerFile, {encoding:'utf8', flag:'r'}))
}

function parseLedger(ledger) {
    let r = new Map()
    ledger?.forEach(m => 
        {
            if (!r.has(m.sender))
                r.set(m.sender,0)
            if (!r.has(m.recipient))
                r.set(m.recipient,0)
            r.set(m.sender, r.get(m.sender) - m.amount)
            r.set(m.recipient, r.get(m.recipient) + m.amount)
        })
    return r
}

function updateBank() {
    bank = parseLedger(getLedger())
}

updateBank()

function mint(user, amount, from, message) {
    if (!Number.isInteger(amount))
        return "Not a valid number"

    if (amount <= 0)
        return "Must be positive"

    writeTransaction(from, user, amount, message)
    updateBank()
    return null
}

function send(sender, recipient, amount, message) {
    if (!Number.isInteger(amount))
        return "Not a valid number"

    if (amount <= 0)
        return "Must be positive"

    if (!bank.has(sender))
        return "User not in bank"

    if (bank.get(sender) < amount)
        return "You ain't got enough coin!"

    if (locks.has(sender))
        return "User currently locked"

    try {
        locks.add(sender)
        if (!bank.has(recipient))
            signup(recipient)
        writeTransaction(sender, recipient, amount, message)
        updateBank()
        return null
    }
    finally {
        locks.delete(sender)
    }
}

function getCachedBalance(userId) {
    if(bank.has(userId)) 
        return bank.get(userId)
    return 0
}

async function parseLedgerEntry(guild, entry) {
    let sender = await users.tryParseUser(guild, entry.sender)
    let recipient = await users.tryParseUser(guild, entry.recipient)
    return [sender, recipient, entry.amount, entry.ts, entry.message]
}
const ledgerConfig = {
    columns: [{},
              {},
              {},
              {},
              {width: 40}]
  };

async function printLedger(guild, filter) {
    filter = filter ?? function() { return true; }
    let ledger = getLedger()
    ledger = ledger?.filter(filter)
    let header = [["Sender", "Recipient", "Amount", "Time", "Message"]]
    let dataPromises = []
    ledger?.forEach(entry => dataPromises.push(parseLedgerEntry(guild, entry)))
    let data = await Promise.all(dataPromises)
    return table.table(header.concat(data), ledgerConfig)
}

function signup(user) {
    if (locks.has(user)) 
        return "User currently locked"
    locks.add(user) 
    try {
        let alreadySignedUp = new Set()
        fs.readFileSync(signupFile, {encoding:'utf8', flag:'r'})
            .split("\n")
            .filter(x => x && x.length > 0)
            .forEach(x => {
                alreadySignedUp.add(x)
            })
        if (alreadySignedUp.has(user))
            return "Already signed up!"
        fs.appendFileSync(signupFile, "\n" + user)
        return mint(user, signupAmount, users.mint, "Sign up bonus!")
    }
    finally {
        locks.delete(user)
    }
}

export { getCachedBalance, send, mint, signup, printLedger, signupAmount }