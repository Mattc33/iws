import { Injectable } from '@angular/core'
import * as _moment from 'moment'
@Injectable()
export class RatecardImporterUtils {
    dateToEpoch = (date: string): number => _moment(date).unix()
}