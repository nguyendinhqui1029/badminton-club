export function getUTCDate(date: Date) {
    return new Date(date.toUTCString())
}