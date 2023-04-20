function stripUser(text) {
    return text.trim().replace("<@", "").replace(">", "")
}

function cleanWhiteSpace(text) {
    return text.toLowerCase().trim().replace(/   */, " ")
}

function now() {
    return new Date(Date.now()).toLocaleString('en-gb', {timeZone: 'America/Toronto'}) + " EST"
}

function randInt(max) {
    return Math.floor(Math.random() * max);
  }

export { stripUser, cleanWhiteSpace, now, randInt }