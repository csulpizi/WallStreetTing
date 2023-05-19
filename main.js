import * as config from './config.js'
import * as shop from './shop/switchboard.js'
import * as casino from './casino/switchboard.js'
import * as main from './main/switchboard.js'
import * as onlytingz from './onlyfans/switchboard.js'
import { stripUser, cleanWhiteSpace, isDm } from './common.js';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { readMetaData } from './metadata.js'
import { botChannel, seedChannelLookup } from './channels.js'

const help = "@me first, followed by the following commands + arguments:\n" +
"- `send <@recipient> <amount> & anything you want to include as a message`:\n" +
"    transacts the specified amount to the recipient.\n" +
"- `balance <@user>`:\n" + 
"    replies with the balance of the specified user. If no user specified, returns your own balance.\n" +
"- `signup <@user>`:\n" + 
"    gives the specified user their initial signup bonus. If no user is specified, defaults to yourself.\n" +
"- `history <@user>`:\n" +
"    lists the transaction history of the specified user. If no user is specified, defaults to yourself.\n" + 
"- `history global`:\n" + 
"    lists the transaction history of everyone.\n" + 
"- `casino help`:\n" + 
"    explains the casino\n" +
"- `shop help`:\n" + 
"    explains the shop\n" +
"- `onlytingz help`:\n" +
"    explains onlytingz\n" +
"- `help`:\n" +
"    you're already here, dummy!"

var clientId = null;

async function switchboard(message) {
    if (message.author.id == clientId)
        return

    let messageContent = cleanWhiteSpace(message.content).split(" ")

    if (isDm(message) && messageContent.length > 0 && stripUser(messageContent[0]) != client.user.id)
        messageContent.unshift(client.user.id);

    if (messageContent.length > 0 && stripUser(messageContent[0]) == client.user.id) {
        console.log("Recieved a message!", messageContent)
        let args = messageContent.slice(1)

        if (args.length == 0) {
            return help
        }

        switch (args[0]) {
            case "help": 
                return help
            case "shop":
                return await shop.incoming(message, args.slice(1))
            case "casino":
                return await casino.incoming(message, args.slice(1))
            case "onlytingz":
                return await onlytingz.incoming(message, args.slice(1))
            default: 
                return await main.incoming(message, args)
        }
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMembers,
    ], 
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
    ]
})

client.on('ready', () => {
    clientId = client.user.id;
    seedChannelLookup(client);
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async function(message) {
    try {
        let r = await switchboard(message)
        if (r == "✅") {
            message.react("✅")
        } else if (r) {
            let wst = await botChannel();
            await wst.send("" + r);
        }
    } catch (e) {
        console.error(e)
    }
})

const reaccRateLimiter = new Map();

client.on('messageReactionAdd', async function(messageReaction, user) {
    messageReaction = await messageReaction.fetch();
    if (messageReaction.message.author.id != clientId) return;
    if (user.id == clientId) return;
    console.log("REACC", messageReaction.emoji.name);

    let rateLimiterTag = user.id + "||" + messageReaction.message.id;
    if (reaccRateLimiter.has(rateLimiterTag)) {
        if (reaccRateLimiter.get(rateLimiterTag) + 5000 > Date.now())  {
            console.log("User " + user.name + " has been emoji rate limited");
            return;
        }
    } else {
        reaccRateLimiter.set(rateLimiterTag, Date.now());
    }

    try {
        let meta = readMetaData(messageReaction.message.id);
        let error = await onlytingz.reaccs(user, messageReaction.message, messageReaction.emoji, meta)
        if (error) {
            await messageReaction.message.reply(`<@${user.id}>: ${error}`);
        }
    } catch (e) {
        console.error(e);
    }
});

console.log("Okay...")
client.login(config.token).catch(err => console.log(err));

export { client, clientId };