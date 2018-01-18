import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RateCardsSharedService {

  // Passing rowID from carrier-table => delete dialog
  rowObjSource = new BehaviorSubject<object>({});
  currentRowObj = this.rowObjSource.asObservable();

  changeRowObj(rowObj: object) {
    this.rowObjSource.next(rowObj);
  }
}

