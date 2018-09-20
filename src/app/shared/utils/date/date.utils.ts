import * as _moment from 'moment'

export default class DateUtils {

    // ? Returns a date string in DDMMYYYY || MMDDYYYY format to epoch at 12:00am
    static dateStringToEpoch = (date: string): number => _moment(date, ['DDMMYYYY', 'MMDDYYYY', "YYYYMDD"]).unix() * 1000

}