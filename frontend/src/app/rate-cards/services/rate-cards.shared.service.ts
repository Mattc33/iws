import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RateCardsSharedService {

    // Passing rowObj from ratecard-all-table => delete dialog
    rowObjSource = new BehaviorSubject<object>({});
    currentRowObj = this.rowObjSource.asObservable();

    // Passing rates rowObj from rate table => delete dialog
    rowRatesObjSource = new BehaviorSubject<object>({});
    currentRowRatesObj = this.rowRatesObjSource.asObservable();

    changeRowObj(rowObj: object) {
        this.rowObjSource.next(rowObj);
    }

    changeRowRatesObj(rowObj: object) {
        this.rowRatesObjSource.next(rowObj);
        console.log('shared service -->')
        console.log(rowObj);    
    }
}

