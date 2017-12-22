import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Carrier } from '../models/carrier.model';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class CarrierService {
    url = 'http://172.20.13.129:8943/';
    rowData: any[];
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    /*
    initialLoad() is returning an obj of type Observable that is an array defined in Carriers Model as an obj
    we .map is as json format then return the data
    .do(logs the json object to console)
    .catch(will catch errors and trigger handleError method)
    our view components can later .subscribe to the data
    */
    initialLoad(): Observable<Carrier[]> {
        return this.http.get(this.url + 'carriers/')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    postAddRow(param: any): Observable<any> {
        return this.http
            .post(this.url + 'carriers/', param, this.options)
            .catch(this.handleError);
    }

    delDeleteRow(param: any): Observable<any> {
        return this.http
            .delete(this.url + 'carriers/' + param)
            .catch(this.handleError);
    }

    // I need the row ID, the column, and the current value of that particular field. 3 things
    putEditField(param: any, id: number): Observable<any> {
        return this.http
            .put(this.url + '/carriers/' + id, param)
            .catch(this.handleError);
    }

    handleError(error: any): any {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
