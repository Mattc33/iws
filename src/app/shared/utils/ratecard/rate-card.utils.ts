export default class RatecardUtils {

    static find = (array, key, value) => array.find( obj => obj[key] === value)

    static getMinRate = (arr: Array<{buy_rate: number}>): number => {
        const rateArr = arr.map( eaRate => eaRate.buy_rate)
        return Math.min(...rateArr)
    }

    static getMaxRate = (arr: Array<{buy_rate: number}>): number => {
        const rateArr = arr.map( eaRate => eaRate.buy_rate)
        return Math.max(...rateArr)
    }
}