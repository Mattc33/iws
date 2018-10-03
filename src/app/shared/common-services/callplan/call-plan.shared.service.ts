import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CallPlanSharedService {

    // Passing rowIdAll from callplan-all-table => delete dialog
    rowAllSource = new BehaviorSubject<number>(0);
    currentRowAll = this.rowAllSource.asObservable();

    // Passing rowObj Ratecards from callplan-ratecards-table => dettach ratecards dialog
    rowRatecardsObjSource = new BehaviorSubject<object>({});
    currentRatecardsObj = this.rowRatecardsObjSource.asObservable();

    // Passing rowObj codes from callplan-ratecards-table => dettach ratecards dialog
    rowCodesObjSource = new BehaviorSubject<object>({});
    currentCodesObj = this.rowCodesObjSource.asObservable();

    // Passing Call Plan Object
    callPlanObjSource = new BehaviorSubject<object>({});
    currentCallPlanObj = this.callPlanObjSource.asObservable();


  changeRowAll(rowAllId: number) {
    this.rowAllSource.next(rowAllId);
  }

  changeRowRatecards(rowRatecardsObj: object) {
    this.rowRatecardsObjSource.next(rowRatecardsObj);
  }

  changeRowCodes(rowCodesObj: object) {
      this.rowCodesObjSource.next(rowCodesObj);
  }

  changeCallPlanObj(callPlanObj: object) {
    this.callPlanObjSource.next(callPlanObj);
  }

}
