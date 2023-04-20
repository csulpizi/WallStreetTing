import * as bank from '../bank.js'

const nft_cost = 3

async function nft(message) {
    if (bank.getCachedBalance(message.author.id) < nft_cost) {
        return "You're too poor"
    }

    var request = await axios.get("https://picsum.photos/400/300")
    let pic = request.request.res.responseUrl
    

    bank.send(message.author.id, "TINGZPORIUM SHOP", 3, "NFT Purchase: " + pic)
    
    return pic + "\nPlease do not screenshot this!"
}

export { nft }