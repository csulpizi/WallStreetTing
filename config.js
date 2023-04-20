import fs from 'fs'

const token = fs.readFileSync("./token.info", {encoding:'utf8', flag:'r'})

export { token }