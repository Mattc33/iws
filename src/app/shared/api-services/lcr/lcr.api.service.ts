import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

import { ApiSettingsSharedService } from '../../services/global/api-settings.shared.service';

@Injectable()
export class LCRService {
    private url: string;
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

    get_allOffers(): Observable<any> { // All call plans in LCR
        return this._http
            .get(this.url + 'lcr/offers')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_specificOffer(carrier_id: number): Observable<any> {
        return this._http
            .get(this.url + '/lcr/offers/' + carrier_id)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_allCarriers(): Observable<any> { // All carriers in LCR
        return this._http
            .get(this.url + 'lcr/providers')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_allTrunks(): Observable<any> {
        return this._http
            .get(this.url + 'lcr/trunks')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_allRatecards(): Observable<any> {
        return this._http
            .get(this.url + 'lcr/ratecards')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_ratesInRatecard(ratecard_id: number): Observable<any> {
        return this._http
            .get(this.url + 'lcr/ratecards/' + ratecard_id + '/rates')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    handleError(error: any): any {
        console.error(error);
    }
}


