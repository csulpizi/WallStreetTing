import * as commands from './commands.js'

async function incoming(message, args) {
    switch(args[0]) {
        case "send":
            return await commands.send(message, args.slice(1))
        case "balance":
            return commands.balance(message, args.slice(1))
        case "balenciaga":
            return commands.balance(message, args.slice(1))
        case "mint":
            return commands.mint(message, args.slice(1))
        case "signup":
            return await commands.signup(message, args.slice(1))
        case "history":
            return await commands.history(message, args.slice(1))
        default: 
            return "Unknown command"
    }
}

export { incoming }