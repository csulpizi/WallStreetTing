import { send } from "../bank.js";
import { cleanWhiteSpace, coerceInt, findChannel, stripUser } from "../common.js";
import { client, clientId } from "../main.js";
import { saveMetaData, readMetaData } from "../metadata.js";

async function broadcastPost(ogMessage, cost, targetTextChannelObj) {
    let user = ogMessage.author;
    let meta = {type: "onlytingz",
                id: ogMessage.id,
                author: ogMessage.author.id};
    let messageText = `<@${user.id}> has posted an OnlyTingz message. The message costs $${cost} to see.\n`;
    messageText += `React with 👀 to view it.`;
    let msg = await targetTextChannelObj.send({content: messageText});
    saveMetaData(msg.id, meta)
    await msg.react("👀")
}

function stripPost(ogMessage) {
    let text = ogMessage.content;
    text = cleanWhiteSpace(text);
    let args = text.split(' ');
    console.log("Checking length...", args.length)
    if (args.length < 5) return null;
    console.log("Checking the og message is in fact sent to @me...", args[0], stripUser(args[0]), client.userId)
    if (stripUser(args[0]) != clientId) return null;
    console.log("Checking it is in fact an 'onlytingz' message", args[1])
    if (args[1] != "onlytingz") return null;
    console.log("Checking it is in fact a 'post' message", args[2])
    if (args[2] != "post") return null;
    // ignore arg 3 I guess
    console.log("Checking the cost", args[4]);
    let cost = parseInt(args[4]);
    if (!Number.isInteger(cost)) return null;
    console.log("All good!");
    return {cost, 
            message: args.slice(5).join(' '), 
            attachments: ogMessage.attachments.map((v) => v)};
}

async function _viewPost(user, ogMessage) {
    let post = stripPost(ogMessage);
    if (!post) return "The referenced message is not a valid onlytingz post!";
    let error = send(user.id, ogMessage.author.id, post.cost, `onlytingz post \`${ogMessage.id}\``);
    if (error) return error;
    await user.send({content: `<@${ogMessage.author.id}>'s onlytingz post:\n` + post.message, files: post.attachments});
}

async function makePost(message, args) {
    if (args.length < 2) return "Not enough args: needs channel id, cost";
    let channel;
    try {
        channel = await findChannel(args[0]);
    } catch {}
    if (!channel) return `Couldn't find channel ${args[0]}`
    let cost = coerceInt(args[1]);
    await broadcastPost(message, cost, channel);
}

async function viewPost(user, message, meta) {
    let poster;
    try {
        poster = (await message.guild.members.fetch(meta.author)).user;
    } catch {}
    if (!poster) return `Something went wrong, couldn't find author ${meta.author}...`;
    let postMessage;
    try {
        console.log(poster);
        let dmChannel = poster.dmChannel || await poster.createDM()
        postMessage = await dmChannel.messages.fetch(meta.id);
    } catch (e) {
        console.error(e);
    }
    if (!postMessage) return `Couldn't find message ${meta.id}`;
    return await _viewPost(user, postMessage);
}

export { viewPost, makePost };