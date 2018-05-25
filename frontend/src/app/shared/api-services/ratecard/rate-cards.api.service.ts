import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

import { ApiSettingsSharedService } from './../../services/global/api-settings.shared.service';

@Injectable()
export class RateCardsService {
    url: string;
    headers: Headers;
    options: RequestOptions;

    constructor(
        private _http: Http,
        private _apiSettings: ApiSettingsSharedService
    ) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }

    get_ratecard(): Observable<any> {
        return this._http
            .get(this.url + 'ratecards')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_ratesInRatecard(ratecardId: number): Observable<any> {
        return this._http
            .get(this.url + 'ratecards/' + ratecardId + '/rates')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_specificRatecard(ratecardId: number): Observable<any> {
        return this._http
            .get(this.url + 'ratecards/' + ratecardId)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_ratesByCountry(isoCode: string) {
        return this._http
            .get(this.url + 'carriers/ratecards/rates/' + isoCode)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    post_addRatecard(body: any): Observable<any> {
        return this._http
            .post(this.url + 'ratecards/', body)
            .pipe(
                catchError(this.handleError)
            );
    }

    del_deleteRatecard(rowId: number): Observable<any> {
        return this._http
            .delete(this.url + 'ratecards/' + rowId)
            .pipe(
                catchError(this.handleError)
            );
    }

    put_editRatecard(body: any, rowID: any): Observable<any> {
        return this._http
            .put(this.url + 'ratecards/' + rowID, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    post_AttachTrunk(ratecardId: number, trunkId: number) {
        const body = {};
        return this._http
            .post(this.url + 'ratecards/' + ratecardId + '/trunks/' + trunkId, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    del_DetachTrunk(ratecardId: number, trunkId: number) {
        const body = {};
        return this._http
            .delete(this.url + 'ratecards/' + ratecardId + '/trunks/' + trunkId, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    put_EditRates(ratesId: number, body: any): Observable<any> {
        return this._http
            .put(this.url + 'rates/' + ratesId, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    put_EditTeleuDbRates(teleuDbRatesId: number, body: any): Observable<any> {
        return this._http
            .put(this.url + '/teleu/rate/' + teleuDbRatesId, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    handleError(error: any): any {
        console.error(error);
    }
}
