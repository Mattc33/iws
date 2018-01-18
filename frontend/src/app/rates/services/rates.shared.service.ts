import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RatesSharedService {

    // Passing rowID from all-rates-table => delete dialog; all
    allRowObjSource = new BehaviorSubject<{}>({id: 0, ratecard_id: 0});
    currentAllRowObj = this.allRowObjSource.asObservable();


    // Passing rowID from carrier-table => delete dialog; tele u
    teleuRowIDSource = new BehaviorSubject<number>(0);
    currentTeleuRowID = this.teleuRowIDSource.asObservable();

    // all
    changeAllRowObj(rowObj: {}) {
        this.allRowObjSource.next(rowObj);
        console.log(rowObj);
    }

    // tele-u
    changeTeleuRowId(rowID: number) {
        this.teleuRowIDSource.next(rowID);
    }
}
