import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class LCRService {
    private url = 'http://172.20.13.129:8943/';
    private headers: Headers;
    private options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    get_allOffers(): Observable<any> { // All call plans in LCR
        return this.http.get(this.url + 'lcr/offers')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log(data));
    }

    get_specificOffer(carrier_id: number): Observable<any> {
        return this.http.get(this.url + '/lcr/offers/' + carrier_id)
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log(data));
    }

    get_allCarriers(): Observable<any> { // All carriers in LCR
        return this.http.get(this.url + 'lcr/providers')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log(data));
    }

    get_allTrunks(): Observable<any> {
        return this.http.get(this.url + 'lcr/trunks')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log(data));
    }

    get_allRatecards(): Observable<any> {
        return this.http.get(this.url + 'lcr/ratecards')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log(data));
    }

    get_rates(ratecard_id: number): Observable<any> {
        return this.http.get(this.url + 'lcr/ratecards/' + ratecard_id + '/rates')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log(data));
    }

    handleError(error: any): any {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}


