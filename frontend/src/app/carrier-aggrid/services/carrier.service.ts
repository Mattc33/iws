import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Carrier } from '../models/carrier.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CarrierAggridService {
    stocksUrl = 'http://localhost:5000/';
    rowData: any[];

    constructor(private http: Http) {}

    initialLoad(): Observable<Carrier[]> {
        return this.http.get(this.stocksUrl + 'gettabledata')
            .map(res => res.json())
            .catch(this.handleError);
    }

    handleError(error: any): any {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
