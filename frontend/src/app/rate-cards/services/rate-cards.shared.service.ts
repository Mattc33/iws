import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RateCardsSharedService {

  // Passing rowID from carrier-table => delete dialog
  rowIDSource = new BehaviorSubject<number>(0);
  currentRowID = this.rowIDSource.asObservable();

  changeRowID(rowID: number) {
    this.rowIDSource.next(rowID);
  }
}

