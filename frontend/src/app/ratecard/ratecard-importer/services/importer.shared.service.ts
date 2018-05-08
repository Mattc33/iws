import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ImporterSharedService {

    postTableObjSource = new BehaviorSubject<Array<[{}]>>([]);
    currentPostTableObj = this.postTableObjSource.asObservable();

    changePostTableObj(rowArr: Array<[{}]>) {
        this.postTableObjSource.next(rowArr);
        console.log(rowArr);
    }

}
