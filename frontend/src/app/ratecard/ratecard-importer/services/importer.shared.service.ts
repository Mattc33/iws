import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ImporterSharedService {

    postTableObjSource = new BehaviorSubject<Array<[{}]>>([]);
    currentPostTableObj = this.postTableObjSource.asObservable();

    postRatesCSVAmount = new BehaviorSubject<number>(0);
    currentRatesCSVAmount = this.postRatesCSVAmount.asObservable();

    changePostTableObj(rowArr: Array<[{}]>) {
        this.postTableObjSource.next(rowArr);
        console.log(rowArr);
    }

    changeRatesCSVAmount(ratesAmount: number) {
        this.postRatesCSVAmount.next(ratesAmount);
        console.log(ratesAmount);
    }

}
