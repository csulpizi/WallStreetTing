/** 
 * Outputs string when there's an error, int otherwise
 * Output: string or int
*/
function coerceInt(x) {
    if (x.match(/[^0-9]/))
        return "Invalid amount provided"
    
    if (x.length >= 6)
        return "No. Fuck off."
    
    let amount = Number.parseInt(x)
    if (Number.isNaN(amount))
        return "Invalid amount provided"
    
    return amount
}

export { coerceInt }