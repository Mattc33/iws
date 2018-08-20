import { Injectable } from '@angular/core'

@Injectable()
export class RatecardManagerUtils {
    unixToLocalTime(unix: number): string {
        const date = new Date(unix * 1000)
        const month = date.getMonth()
        const day = date.getDay()
        const year = date.getFullYear()
        return `${month}/${day}/${year}`
    }

    find(array, key, value) {
        return array.find( obj => obj[key] === value)
    }
}