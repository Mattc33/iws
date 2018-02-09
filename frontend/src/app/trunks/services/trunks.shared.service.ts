import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TrunksSharedService {

    rowObjSource = new BehaviorSubject<object>({});
    currentRowObj = this.rowObjSource.asObservable();

    changeRowObj(rowId: object) {
        this.rowObjSource.next(rowId);
        console.log('updated rowId: ' + rowId)
    }
}