import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Carrier } from '../models/carrier.model';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';


@Injectable()
export class CarrierService {

    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    // getCarriers is returning an obj of type Observable that is an array defined in Carriers Model as an obj
    // we map is as json format then return the data
    // .do(logs the json object to console)
    // .catch(will catch errors and trigger _serverError method)
    getCarriers(): Observable<Carrier[]> {
        let url = 'http://localhost:5000/gettabledata';
        return this.http
            .get(url)
            .map(res => <Carrier[]> res.json())
            .do(data => console.log('server data:', data))
            .catch(this._serverError);
    }

    postAddRow(param: any): Observable<any> {
        const url = 'http://localhost:5000/insertrow/';
        return this.http
            .post(url, param, this.options)
            .catch(this._serverError);
    }

    delDeleteRow(param: any): Observable<any> {
        // Creating request with appropriate headers/body for delete
        const url = 'http://localhost:5000/deleterow';
        const body = JSON.stringify(
            {
              'id': param,
            }
        );
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({
            headers: headers,
            body : body
        });

        return this.http
            .delete(url, options)
            .catch(this._serverError);
    }

    private _serverError(err: Response) {
        console.log('server error: ', err);  // debug
        return Observable.throw(err.json().error || 'Server error');
    }
}
