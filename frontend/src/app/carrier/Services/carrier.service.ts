import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()

export class CarrierService {
    
    constructor(private _http: Http) { }

    getCarriers() {
        return this._http.get('http://localhost:5000/gettabledata')
            .map(
                (res) => res.json()
            );
    }
}