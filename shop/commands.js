import * as bank from '../bank.js'
import axios from 'axios';

const prices = {nft: 3}

async function nft(message) {
    if (bank.getCachedBalance(message.author.id) < prices.nft) {
        return "You're too poor"
    }

    var request = await axios.get("https://picsum.photos/400/300")
    let pic = request.request.res.responseUrl
    

    bank.send(message.author.id, "TINGZPORIUM SHOP", prices.nft, "NFT Purchase: " + pic)
    
    return pic + "\nPlease do not screenshot this!\nNew balance: " + bank.getCachedBalance(message.author.id) 
}

export { prices, nft }