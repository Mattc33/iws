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

    getMinRate(arr: Array<{buy_rate: number}>): number {
        const rateArr = arr.map( eaRate => eaRate.buy_rate)
        return Math.min(...rateArr)
    }

    getMaxRate(arr: Array<{buy_rate: number}>): number {
        const rateArr = arr.map( eaRate => eaRate.buy_rate)
        return Math.max(...rateArr)
    }
}