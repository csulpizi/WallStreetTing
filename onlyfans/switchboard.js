import { isDm } from '../common.js';
import * as commands from './commands.js'

const help = "For feet pics only!\n" +
"- `post <channelId> <cost> ... content`:\n" +
"    MUST BE SENT IN A DM TO WALLSTREETTING\n" +
"    Post the content as an only tingz post, which people can pay <cost> to see\n"

// arguments: 
//  e.g. the message @bot onlytingz a b c 
//       would have arguments = [a, b, c]
async function incoming(message, args) {
    if (args.length == 0)
        return help
    switch (args[0]) {
        case "post":
            if (isDm(message)) {
                return await commands.makePost(message, args.slice(1));
            }
            return "You can only make posts in DM's to me!"
        case "help":
            return help
    }
}

async function reaccs(user, message, react, meta) {
    if (meta.type == "onlytingz" && react.name == "👀") {
        return await commands.viewPost(user, message, meta)
    }
    return null;
}

export { incoming, reaccs }