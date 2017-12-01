import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Carrier } from '../models/carrier.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';

@Injectable()
export class CarrierService {

    private serviceUrl = 'http://localhost:5000/gettabledata';

    constructor(private _http: Http) {}

    // getCarriers is returning an obj of type Observable that is an array defined in Carriers Model as an obj
    // we map is as json format then return the data
    getCarriers(): Observable<Carrier[]> {
        return this._http.get(this.serviceUrl)
        .map(res => <Carrier[]> res.json())
        .do(data => console.log('server data:', data))
        .catch(this._serverError);
    }

    private _serverError(err: any) {
        console.log('sever error:', err);  // debug
        if (err instanceof Response) {
          return Observable.throw(err.json().error || 'backend server error');
          // if you're using lite-server, use the following line
          // instead of the line above:
          // return Observable.throw(err.text() || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }
}
