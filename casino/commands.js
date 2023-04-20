import { coerceInt } from "../coerce.js"
import * as bank from "../bank.js"
import { randInt } from "../common.js"

function playOdds(message, args, oddsAgainst) {
    console.log(args)

    if (args.length != 1) {
        return "You must specify exactly one argument: an amount to bet"
    }
    let amountOrError = coerceInt(args[0])
    if (!Number.isInteger(amountOrError)) {
        return amountOrError
    }
    let amount = amountOrError

    if (amount <= 0) {
        return "Must be a positive number"
    }

    if (bank.getCachedBalance(message.author.id) < amount) {
        return "You're too poor"
    }
    
    let roll = randInt(oddsAgainst + 1)
    if (roll == 0) {
        bank.mint(message.author.id, amount * oddsAgainst, "BIG BURLY CASINO BOUNCERS", "Casino winnings!")
        return 0
    } else {
        bank.send(message.author.id, "BIG BURLY CASINO BOUNCERS", amount, "Casino losings...")
        return roll
    }
}

export { playOdds }