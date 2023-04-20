import * as commands from './commands.js'

const help = "Tingzporium Shop:\n" + 
    "- `nft`:\n" +
    `  $${commands.prices.nft}: make a da nft\n` +
    "- `gif <some tag>`:\n" +
    `  $${commands.prices.gif}: post a gif. provide a tag (or don't) to get a gif related to that tag`

async function incoming(message, args) {
    if (args.length == 0)
        return help

    switch(args[0]) {
        case "help":
            return help
        case "nft":
            return await commands.nft(message, args.slice(1))
        case "gif":
            return await commands.gif(message, args.slice(1))
    }
}

export { incoming }