import * as bank from '../bank.js'
import axios from 'axios';
import querystring from 'node:querystring'; 
import * as users from '../users.js';
import { botChannel } from '../channels.js';

const prices = {nft: 3,
                gif: 1}

async function nft(message) {
    if (bank.getCachedBalance(message.author.id) < prices.nft) {
        return `<@${message.author.id}>: You're too poor`
    }

    var request = await axios.get("https://picsum.photos/400/300")
    let pic = request.request.res.responseUrl
    

    bank.send(message.author.id, users.shop, prices.nft, "NFT Purchase: " + pic)
    
    let bc = await botChannel()
    await bc.send(pic)
    return `<@${message.author.id}>\nPlease do not screenshot this!\nNew balance: ` + bank.getCachedBalance(message.author.id) 
}

async function gif(message, args) {
    const opts = {
		apiKey: "0UTRbFtkMxAplrohufYco5IY74U8hOes",
		rating: "r"
	};
    if (args.length >= 1) {
        opts.tag = args.join(" ")
    }

    if (bank.getCachedBalance(message.author.id) < prices.gif) {
        return "You're too poor"
    }


    var request = await axios.get("https://api.giphy.com/v1/gifs/random?" + querystring.encode(opts))
    let gif = request.data.data.images.original.url
    
    bank.send(message.author.id, users.shop, prices.gif, "Gif Purchase: " + gif)
    return gif
}

export { prices, nft, gif }