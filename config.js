import fs from 'fs'

const token = fs.readFileSync("./token.info", {encoding:'utf8', flag:'r'})
const serverId = fs.readFileSync("./serverId.info", {encoding:'utf8', flag:'r'})

export { token, serverId }