const oneDay = 1000 * 60 * 60 * 24

export function getDefaultExpiryDate() : Date {
    return new Date(new Date().getTime() + oneDay)
}