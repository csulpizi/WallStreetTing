import * as commands from './commands.js'

async function incoming(message, args) {
    switch(args[0]) {
        case "nft":
            return await commands.nft(message)
    }
}

export { incoming }