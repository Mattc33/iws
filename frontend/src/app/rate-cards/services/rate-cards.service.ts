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
    rowData: any[];
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    // For Add Rate Card dropdown, needs name and id
    get_CarrierNames(): Observable<any> {
        return this.http.get(this.url + 'carriers/')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_RateCard(): Observable<any> {
        return this.http.get(this.url + 'ratecards/')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data', data));
    }

    post_AddRateCard(param: any): Observable<any> {
        return this.http
            .post(this.url + 'ratecards/', param, this.options)
            .catch(this.handleError);
    }

    del_DeleteRateCard(param: any): Observable<any> {
        return this.http
            .delete(this.url + 'ratecards/' + param)
            .catch(this.handleError);
    }

    put_EditField(param: any, id: number): Observable<any> {
        return this.http
            .put(this.url + 'ratecards/' + id, param)
            .catch(this.handleError);
    }

    handleError(error: any): any {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
