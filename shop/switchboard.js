import * as commands from './commands.js'

const help = "Tingzporium Shop:\n" + 
    "- `nft`: $" + commands.prices.nft + "\n" +
    `  make a da nft`

async function incoming(message, args) {
    if (args.length == 0)
        return help

    switch(args[0]) {
        case "help":
            return help
        case "nft":
            return await commands.nft(message)
    }
}

export { incoming }