import { send } from "../bank.js";
import { cleanWhiteSpace, coerceInt, stripUser } from "../common.js";
import { client, clientId } from "../main.js";
import { saveMetaData } from "../metadata.js";
import { findChannel } from "../channels.js";

async function broadcastPost(ogMessage, cost, targetTextChannelObj, caption) {
    let user = ogMessage.author;
    let meta = {type: "onlytingz",
                id: ogMessage.id,
                author: ogMessage.author.id};
    let messageText = `<@${user.id}> has posted an OnlyTingz picture` ;
    if (caption.length > 0) {
        messageText += ` with the caption '${caption}'`; 
    }
    messageText += `.\nThe message costs $${cost} to see.\n`;
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
    if (stripUser(args[0]) == clientId) args.slice(1);
    if (args.length < 4) return null;
    console.log("Checking it is in fact an 'onlytingz' message", args[0])
    if (args[0] != "onlytingz") return null;
    console.log("Checking it is in fact a 'post' message", args[1])
    if (args[1] != "post") return null;
    // ignore arg 2 I guess
    console.log("Checking the cost", args[3]);
    let cost = parseInt(args[3]);
    if (!Number.isInteger(cost)) return null;
    console.log("All good!");
    return {cost, 
            message: args.slice(5).join(' '), 
            attachments: ogMessage.attachments.map((v) => v)};
}

const viewPostNonce = new Set();

async function _viewPost(user, ogMessage) {
    let post = stripPost(ogMessage);
    if (!post) return "The referenced message is not a valid onlytingz post!";
    let nonce = user.id + "|" + ogMessage.id;
    if (viewPostNonce.has(nonce)) return;
    let error = send(user.id, ogMessage.author.id, post.cost, `onlytingz post \`${ogMessage.id}\``);
    if (error) return error;
    try {
        await user.send({content: `<@${ogMessage.author.id}>'s onlytingz post:\n` + post.message, files: post.attachments});
    } catch (e) {
        console.error(e);
        send(ogMessage.author.id, user.id, post.cost, `onlytingz refund \`${ogMessage.id}\``);
        return "Can't seem to be able to send you a direct message! Double check your server privacy settings allow dm's"
    }
    viewPostNonce.add(nonce);
}

async function makePost(message, args) {
    if (args.length < 2) return "Not enough args: needs channel id, cost";
    let channel;
    try {
        channel = await findChannel(args[0]);
    } catch {}
    if (!channel) return `Couldn't find channel ${args[0]}`
    let cost = coerceInt(args[1]);
    if (!message.attachments.first())
        return "Needs at least one attachment!"
    await broadcastPost(message, cost, channel, args.slice(2).join(' '));
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