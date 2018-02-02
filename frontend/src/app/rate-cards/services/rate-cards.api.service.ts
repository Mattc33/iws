import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class RateCardsService {
    url = 'http://172.20.13.129:8943/';
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    get_RateCard(): Observable<any> {
        return this.http.get(this.url + 'ratecards/')
            .map(res => res.json())
            .catch(this.handleError)
            .do(res => console.log('server data', res));
    }

    get_CarrierNames(): Observable<any> {
        return this.http.get(this.url + 'carriers/')
            .map(res => res.json())
            .catch(this.handleError)
            .do(res => console.log('server data', res));
    }

    post_AddRateCard(body: any): Observable<any> {
        return this.http.post(this.url + 'ratecards/', body, this.options)
        .catch(this.handleError)
        .do(res => console.log('server data', res));
    }

    del_DeleteRateCard(rowID: any): Observable<any> {
        return this.http.delete(this.url + 'ratecards/' + rowID)
        .catch(this.handleError)
        .do(res => console.log('server data', res));
    }

    put_EditRateCard(body: any, rowID: any): Observable<any> {
        return this.http
            .put(this.url + 'ratecards/' + rowID, body)
            .catch(this.handleError);
    }

    handleError(error: any): any {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
