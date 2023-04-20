import * as commands from './commands.js'

const help = "Gamble away your life savings!\n" +
"- `coin <amount>`:\n" +
"    choose an amount to bet, then flip a coin (1:1 odds)\n" +
"- `dice <amount>`:\n" + 
"    choose an amount to bet, then roll a d6 (1:5 odds)\n" + 
"- `lottery <amount>`:\n" +
"    choose an amount to bet. 1:999 odds good luck loser"

// arguments: 
//  e.g. the message @bot casino a b c 
//       would have arguments = [a, b, c]
async function incoming(message, args) {
    if (args.length == 0)
        return help
    let roll
    switch (args[0]) {
        case "coin":
            roll = commands.playOdds(message, args.slice(1), 1)
            if (!Number.isInteger(roll)) {
                return roll 
            }
            if (roll == 0) return "Heads! You win!"
            return "Sorry, you flipped tails and lost!"
        case "dice":
            roll = commands.playOdds(message, args.slice(1), 5)
            if (!Number.isInteger(roll)) {
                return roll 
            }
            if (roll == 0) return "SIX! You win!"
            return `Sorry, you only rolled a ${6 - roll}, you lose`
        case "lottery":
            roll = commands.playOdds(message, args.slice(1), 999)
            if (!Number.isInteger(roll)) {
                return roll 
            }
            if (roll == 0) return "HOLY FUCK YOU ACTUALLY WON!!!!>!?!?!?!?!??!?!"
            return `Sorry, please play again`
        case "help":
            return help
    }
}

export { incoming }