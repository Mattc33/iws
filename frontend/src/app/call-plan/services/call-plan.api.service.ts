import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class CallPlanService {
    url = 'http://172.20.13.129:8943/';
    rowData: any[];
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    // 
    get_rateCardOfCallPlan6(): Observable<any> {
        return this.http.get(this.url + 'callplans/6')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_allCallPlan(): Observable<any> {
        return this.http.get(this.url + 'callplans/')
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    get_callPlan(callplan_id: number): Observable<any> {
        return this.http.get(this.url + 'callplans/' + callplan_id)
            .map(res => res.json())
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    post_newCallPlan(body: any): Observable<any> {
        return this.http
            .post(this.url + 'callplans/', body, this.options)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    del_callPlan(callplan_id: number): Observable<any> {
        return this.http
            .delete(this.url + 'callplans/' + callplan_id)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    put_editCallPlan(body: any, callplan_id: number): Observable<any> {
        return this.http
            .put(this.url + 'callplans/' + callplan_id, body)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    // attach rate card to call plan
    post_attachRateCard(callplan_id: number, ratecard_id: number, body: any): Observable<any> {
        return this.http
            .post(this.url + 'callplans/' + callplan_id + '/ratecards/' + ratecard_id, body)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    // detach rate card from call plan
    del_detachRateCard(callplan_id: number, ratecard_id: number): Observable<any> {
        return this.http
            .delete(this.url + 'callplans/' + callplan_id + '/ratecards/' + ratecard_id)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    // add new plan code from callplan
    post_newPlanCode(callplan_id: number, body: any): Observable<any> {
        return this.http
            .post(this.url + 'callplans/' + callplan_id + '/code', body)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    // update plan code from callplan
    put_editPlanCode(callplan_id: number, code_id: number, body: any): Observable<any> {
        return this.http
            .put(this.url + 'callplans/' + callplan_id + '/code/' + code_id, body)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }
 
    // delete plan code from callplan
    del_planCode(callplan_id: number, code_id: number): Observable<any> {
        return this.http    
        .delete(this.url + 'callplans/' + callplan_id + '/code/' + code_id)
        .catch(this.handleError)
        .do(data => console.log('server data:', data));
    }

    /*
        ~~~~~~~~~~ LCR ~~~~~~~~~~
    */
    post_carrierToLCR(carrier_id: number, body: any): Observable<any> {
        return this.http
            .post(this.url + 'lcr/carriers/' + carrier_id, body)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    post_ratecardsToLCR(ratecard_id: number, body: any): Observable<any> {
        return this.http
            .post(this.url + 'lcr/ratecards/' + ratecard_id, body)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    post_trunksToLCR(trunk_id: number, body: any): Observable<any> {
        return this.http
            .post(this.url + 'lcr/trunks/' + trunk_id, body)
            .catch(this.handleError)
            .do(data => console.log('server data:', data));
    }

    post_callplanToLCR(callplan_id: number, body: any): Observable<any> {
        return this.http
            .post(this.url + 'lcr/callplans/' + callplan_id, body)
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
