import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class TrunksService {
    private url = 'http://172.20.13.129:8943/';
    private headers: Headers;
    private options: RequestOptions;

    constructor(
        private http: Http
    ) {}

    get_allTrunks(): Observable<any> {
        return this.http.get(this.url + 'trunks')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_specificTrunk(trunkId: number): Observable<any> {
        return this.http.get(this.url + 'trunks/' + trunkId)
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    post_addTrunk(body: any): Observable<any> {
        return this.http.post(this.url + 'trunks', body)
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    del_deleteTrunk(trunkId: number): Observable<any> {
        return this.http.delete(this.url + 'trunks/' + trunkId)
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data)); 
    }

    put_editTrunk(trunkId: number, body): Observable<any> {
        return this.http.put(this.url + 'trunks/' + trunkId, body)
            .map(res => res.json())
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