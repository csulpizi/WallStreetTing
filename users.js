const snowflakeRegex = /[0-9][0-9]*/

const usernameCache = new Map()

async function tryParseUser(guild, userId) {
    if (usernameCache.has(userId))
        return usernameCache.get(userId)

    let r
    if (guild && userId.match(snowflakeRegex)) {
        let member
        try {
            member = await guild.members.fetch(userId)
        } catch {
            member = undefined
        }

        r =  member?.user?.username ?? userId
    } else {
        r = userId
    }
    usernameCache.set(userId, r)
    return r
}

async function isNaturalBornCitizen(guild, userId) {
    try {
        await guild.members.fetch(userId)
        return true
    } catch {
        return false
    }
}

const shop = "TINGZPORIUM SHOP"
const casino ="BIG BURLY CASINO BOUNCERS"
const mint = "Royal Tingmenistan Mint"

export { shop, casino, mint, tryParseUser, isNaturalBornCitizen }