import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class CarrierService {
    private url = 'http://172.20.13.129:8943/';
    private headers: Headers;
    private options: RequestOptions;

    constructor(
        private http: Http
    ) {
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
    get_carriers(): Observable<any> {
        return this.http.get(this.url + 'carriers/')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.table(data));
    }

    post_AddRow(body: any): Observable<any> {
        return this.http
            .post(this.url + 'carriers/', body, this.options)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    del_DeleteRow(rowId: any): Observable<any> {
        return this.http
            .delete(this.url + 'carriers/' + rowId)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    put_EditCarrier(body: any, rowId: number): Observable<any> {
        return this.http
            .put(this.url + 'carriers/' + rowId, body)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    handleError(error: any): any {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
