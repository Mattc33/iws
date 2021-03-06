import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CarrierSharedService {

// example of services to communicate between sibling components
// https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/
// https://stackblitz.com/edit/sharing-data-any-comp?file=main.ts <- simplified example

    // Passing rowID from carrier-table => delete dialog
    rowObjSource = new BehaviorSubject<object>({});
    currentRowObj = this.rowObjSource.asObservable();

    changeRowObj(rowId: object) {
        this.rowObjSource.next(rowId);
        console.log('updated rowId: ' + rowId);
    }
}

