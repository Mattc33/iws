import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { cloneDeep } from 'lodash';

@Injectable()
export class CarrierAggridService {
    stocksUrl: string = 'http://localhost:5000/';
    rowData: any[];

    constructor(private http: Http) {
    }

    // provides the initial (or current state) of the data
    initialLoad(): any {
        return this.http.get(this.stocksUrl + 'gettabledata')
            .map(res => res.json())
            .catch(this.handleError);
    }

    // only returns the changed data rows
    byRowupdates(): any {
        return Observable.create((observer) => {
            const interval = setInterval(() => {
                let changes = [];

                observer.next(changes);
            }, 1000);

            return () => clearInterval(interval);
        });
    }

    // Figure out what this is for later
    extractData(res: Response) : any{
        let body = res.json();
        // https://lodash.com/docs#cloneDeep
        return cloneDeep(this.rowData);
    }

    handleError(error: any): any {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
