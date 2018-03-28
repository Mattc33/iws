import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class LCRService {
    private url = 'http://18.221.27.121:8046/';
    private headers: Headers;
    private options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    get_allOffers(): Observable<any> { // All call plans in LCR
        return this.http
            .get(this.url + 'offers')
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_allProviders(): Observable<any> { // All carriers in LCR
        return this.http
            .get(this.url + 'providers')
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
