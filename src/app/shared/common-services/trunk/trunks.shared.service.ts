import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TrunksSharedService {

    rowObjSource = new BehaviorSubject<object>([{}]);
    currentRowId = this.rowObjSource.asObservable();

    changeRowObj(rowObj: object) {
        this.rowObjSource.next(rowObj);
        console.log('updated rowId:')
        console.table(rowObj)
    }
}