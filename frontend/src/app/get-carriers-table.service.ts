import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GetCarriersTableService {

    constructor( private http: Http ) {}

    public getActivities(): Observable<any> {
        return this.http.get('http://localhost:5000')
            .map(res => res.json());
    }
}
