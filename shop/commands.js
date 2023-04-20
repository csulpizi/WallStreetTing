import * as bank from '../bank.js'
import axios from 'axios';
import querystring from 'node:querystring'; 

const prices = {nft: 3,
                gif: 1}

async function nft(message) {
    if (bank.getCachedBalance(message.author.id) < prices.nft) {
        return "You're too poor"
    }

    var request = await axios.get("https://picsum.photos/400/300")
    let pic = request.request.res.responseUrl
    

    bank.send(message.author.id, "TINGZPORIUM SHOP", prices.nft, "NFT Purchase: " + pic)
    
    message.reply(pic)
    return "Please do not screenshot this!\nNew balance: " + bank.getCachedBalance(message.author.id) 
}

async function gif(message, args) {
    const opts = {
		apiKey: "0UTRbFtkMxAplrohufYco5IY74U8hOes",
		rating: "r"
	};
    if (args.length == 1) {
        opts.tag = args[0]
    }

    else if (args.length > 1) {
        return "Too many arguments!"
    }

    if (bank.getCachedBalance(message.author.id) < prices.gif) {
        return "You're too poor"
    }


    var request = await axios.get("https://api.giphy.com/v1/gifs/random?" + querystring.encode(opts))
    let gif = request.data.data.images.original.url
    
    bank.send(message.author.id, "TINGZPORIUM SHOP", prices.gif, "Gif Purchase: " + gif)
    return gif
}

export { prices, nft, gif }