const snowflakeRegex = /[0-9][0-9]*/

const usernameCache = new Map()

async function tryParseUser(guild, userid) {
    if (usernameCache.has(userid))
        return usernameCache.get(userid)

    let r
    if (guild && userid.match(snowflakeRegex)) {
        let member
        try {
            member = await guild.members.fetch(userid)
        } catch {
            member = undefined
        }

        r =  member?.user?.username ?? userid
    } else {
        r = userid
    }
    usernameCache.set(userid, r)
    return r
}

export { tryParseUser }