import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class RateCardsSharedService {

    rowObjAllSource = new BehaviorSubject<object>({}) // Passing rowObj from ratecard-all-table => delete dialog
    currentRowAllObj = this.rowObjAllSource.asObservable()

    rowRatesObjSource = new BehaviorSubject<object>({}) // Passing rates rowObj from rate table => delete dialog
    currentRowRatesObj = this.rowRatesObjSource.asObservable()

    rowTrunksObjSource = new BehaviorSubject<object>({}); // Passing trunks rowObj from trunks table => delete dialog
    currentRowTrunksObj = this.rowTrunksObjSource.asObservable()

    countryObjSource = new BehaviorSubject<string>('0')
    countryObjCurrent = this.countryObjSource.asObservable()

    changeRowAllObj(rowObj: object): void {
        this.rowObjAllSource.next(rowObj)
    }

    changeRowRatesObj(rowObj: object): void  {
        this.rowRatesObjSource.next(rowObj)
    }

    changeRowTrunksObj(rowObj: object): void  {
        this.rowTrunksObjSource.next(rowObj)
    }

    countryObjChange(countryRowId: string): void  {
        this.countryObjSource.next(countryRowId)
    }
}


