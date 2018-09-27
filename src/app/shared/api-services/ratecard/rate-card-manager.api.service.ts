import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ApiSettingsSharedService } from '../../services/global/api-settings.shared.service';
interface IPostCarrierListToProfile { 
    rateMarkup: number,
    fromCarrierList: Array<object>,
    customerRateList: Array<object>
}
interface IPostCarrierRatesInfoToProfile { 
    "profile": {
        rateMarkup: number,
        fromCarrierList: Array<object>,
        customerRateList: Array<object>
    }
}
@Injectable()
export class RatecardManagerService {
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

    // ================================================================================
    // * Get Carrier/Ratecard Info
    // ================================================================================

    get_ratecardsInCarriersByTier = (carrierId: number, tier: string): Observable<any> => 
        this._http
            .get(`${this.url}/fromCarrier/${carrierId}/tier/${tier}/ratecards?active=1`)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            )
    

    get_ratecardRates = (carrierId: number, ratecardId: number): Observable<any> => 
        this._http
            .get(`${this.url}/fromCarrier/${carrierId}/ratecard/${ratecardId}`)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            )

    // ================================================================================
    // * Post/Get Profile
    // ================================================================================
    post_carrierListToProfile = (toCarrierId: number, tier: string, body: IPostCarrierListToProfile) => {
        console.log(toCarrierId)
        console.log(tier)
        console.log(body)
        console.log(`${this.url}/toCarrier/${toCarrierId}/tier/${tier}/profile`)
        return this._http
            .post(`${this.url}/toCarrier/${toCarrierId}/tier/${tier}/profile`, body, this.options)
            .pipe(
                catchError(this.handleError)
            )
    }

    post_carrierRatesInfoToProfile = (toCarrierId: number, tier: string, body: IPostCarrierRatesInfoToProfile) => {
        console.log(toCarrierId)
        console.log(tier)
        console.log(body)
        console.log(`${this.url}/toCarrier/${toCarrierId}/tier/${tier}/price`)
        return this._http
            .post(`${this.url}/toCarrier/${toCarrierId}/tier/${tier}/price`, body, this.options)
            .pipe(
                catchError(this.handleError)
            )    
    }

    handleError(error: any): any {
        console.error(error);
    }
}
