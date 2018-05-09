import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { ApiSettingsSharedService } from './../../shared/services/global/api-settings.shared.service';

@Injectable()
export class CallPlanService {

    private url;
    private headers: Headers;
    private options: RequestOptions;

    constructor(
        private _http: Http,
        private _apiSettings: ApiSettingsSharedService
    ) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }

    get_allCallplan(): Observable<any> {
        return this._http
            .get(this.url + 'callplans/')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_specificCallplan(callplan_id: number): Observable<any> {
        return this._http
            .get(this.url + 'callplans/' + callplan_id)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    post_newCallPlan(body: any): Observable<any> {
        return this._http
            .post(this.url + 'callplans/', body, this.options)
            .pipe(
                catchError(this.handleError)
            );
    }

    del_callPlan(callplan_id: number): Observable<any> {
        return this._http
            .delete(this.url + 'callplans/' + callplan_id)
            .pipe(
                catchError(this.handleError)
            );
    }

    put_editCallPlan(body: any, callplan_id: number): Observable<any> {
        return this._http
            .put(this.url + 'callplans/' + callplan_id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    // attach rate card to call plan
    post_attachRateCard(callplan_id: number, ratecard_id: number, body: any): Observable<any> {
        return this._http
            .post(this.url + 'callplans/' + callplan_id + '/ratecards/' + ratecard_id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    // detach rate card from call plan
    del_detachRateCard(callplan_id: number, ratecard_id: number): Observable<any> {
        return this._http
            .delete(this.url + 'callplans/' + callplan_id + '/ratecards/' + ratecard_id)
            .pipe(
                catchError(this.handleError)
            );
    }

    // add new plan code from callplan
    post_newPlanCode(callplan_id: number, body: any): Observable<any> {
        return this._http
            .post(this.url + 'callplans/' + callplan_id + '/code', body)
            .pipe(
                catchError(this.handleError)
            );
    }

    // update plan code from callplan
    put_editPlanCode(callplan_id: number, code_id: number, body: any): Observable<any> {
        return this._http
            .put(this.url + 'callplans/' + callplan_id + '/code/' + code_id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    // delete plan code from callplan
    del_planCode(callplan_id: number, code_id: number): Observable<any> {
        return this._http
            .delete(this.url + 'callplans/' + callplan_id + '/code/' + code_id)
            .pipe(
                catchError(this.handleError)
            );
    }

    /*
        ~~~~~~~~~~ LCR ~~~~~~~~~~
    */
    post_callplanToLCR(callplan_id: number, body: any): Observable<any> {
        return this._http
            .post(this.url + 'lcr/callplans/' + callplan_id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    handleError(error: any): any {
        console.error(error);
    }
}
