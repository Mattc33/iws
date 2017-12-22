import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TableService {

// example of services to communicate between sibling components
// https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/
// https://stackblitz.com/edit/angular-shcmcw

  // Passing rowID from carrier-table => delete dialog
  rowIDSource = new BehaviorSubject<number>(0);
  currentRowID = this.rowIDSource.asObservable();

  // Passing field information on add carrier
  carrierObjSource = new BehaviorSubject<{}>({
    code: '',
    name: '',
    email: '' ,
    phone: '',
    address: '',
    taxable: true,
    tier: 0
  });
  currentCarrierObj = this.carrierObjSource.asObservable();

  // Passing 1||0 from delete dialog => carrier-table
  ifDialogSource = new BehaviorSubject<number>(0);
  currentIfDialog = this.ifDialogSource.asObservable();

  changeRowID(rowID: number) {
    this.rowIDSource.next(rowID);
    console.log('updated rowID: ' + rowID);
  }

  changeCarrierObj(carrierObj: {}) {
    this.carrierObjSource.next(carrierObj);
    console.log('updated carrierObj: ' + carrierObj);
  }

  changeIfDialog(ifDialog: number) {
    this.ifDialogSource.next(ifDialog);
    console.log('updated ifDialog: ' + ifDialog);
  }

}

