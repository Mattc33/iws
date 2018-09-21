import * as _moment from 'moment'

export default class DateUtils {

    // ? Returns a date string in DDMMYYYY || MMDDYYYY || DDMMMYY || YYYYMDD
    // ? format to epoch at 12:00am
    static dateStringToEpoch = (date: string): number => 
        _moment(date, ['DDMMYYYY', 'MMDDYYYY', "YYYYMDD", 'DD-MMM-YY']).unix() * 1000

    static unixToLocalTime = (unix: number): string =>
        _moment.unix(unix).format('MMMM Do YYYY')

}