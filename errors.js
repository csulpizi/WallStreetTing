class InvalidQtyArgs extends Error {
    constructor(min, max) {
        super()
        if (max) {
            this.message = `Invalid number of args, expected between ${min} and ${max}`
        } else if (max == min) {
            this.message = `Invalid number of args, expected exactly ${min}`
        } else {
            this.message = `Invalid number of args, expected at least ${min}`
        }
    }
}

class InvalidNumber extends Error {
    constructor() {
        super()
        this.message = `That doesn't look like a valid number to me`
    }
}

class FuckOff extends Error {
    constructor() {
        super()
        this.message = `Fuck off`
    }
}

class Poor extends Error {
    constructor() {
        super()
        this.message = `You're too poor`
    }
}

class InvalidMention extends Error {
    constructor(mention) {
        super()
        this.message = `Invalid mention: ${mention}`
    }
}

export { InvalidQtyArgs, InvalidNumber, InvalidMention, FuckOff, Poor }