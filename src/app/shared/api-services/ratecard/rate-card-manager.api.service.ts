import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ApiSettingsSharedService } from '../../services/global/api-settings.shared.service';

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

    get_ratecardsInCarriersByTier = (carrierId: number, tier: string): Observable<any> => 
        this._http
            .get(`${this.url}fromCarrier/${carrierId}/tier/${tier}/ratecards?active=1`)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            )
    

    get_ratecardRates = (carrierId: number, ratecardId: number): Observable<any> => 
        this._http
            .get(`${this.url}fromCarrier/${carrierId}/ratecard/${ratecardId}`)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            )

    post_carrierListToProfile = (toCarrier_id: number, tier: string, body: Array<{}>): Observable<any> => 
        this._http
            .post(`${this.url}toCarriers/${toCarrier_id}/tier/${tier}/profile`, body, this.options)
            .pipe(
                catchError(this.handleError)
            )

    post_carrierRatesInfoToProfile = (toCarrier_id: number, tier: string, body: Array<{}>): Observable<any> => 
        this._http
            .post(`${this.url}toCarriers/${toCarrier_id}/tier/${tier}/profile`, body, this.options)
            .pipe(
                catchError(this.handleError)
            )    

    // // ? get profile
    // get_profileByToCarrier(carrierId: number): Observable<any> {
    //     return this._http
    //         .get(this.url + carrierId)
    //         .pipe (
    //             map(res => res.json()),
    //             catchError(this.handleError)
    //         );
    // }


    // // ? get a list of ratecards by carrierId
    // // filter for active, filter for standard or premium
    // get_listOfRatecards(carrierId: number, productTier: string): Observable<any> {
    //     return this._http
    //         .get(this.url + 'fromCarrier/' + carrierId + '/tier/' + productTier + '/ratecards')
    //         .pipe (
    //             map(res => res.json()),
    //             catchError(this.handleError)
    //         );
    // }

    // // ? get a specific ratecard with nested rates array with iso code 
    // // as the key and the prefixes as a value of array containing prefixes
    // get_ratecardWithRatesByCountry(carrierId: number, ratecardId: number): Observable<any> {
    //     return this._http
    //         .get(this.url + carrierId + '/' + ratecardId + '/?active=1')
    //         .pipe (
    //             map(res => res.json()),
    //             catchError(this.handleError)
    //         );
    // }

    handleError(error: any): any {
        console.error(error);
    }
}
