import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ApiSettingsSharedService } from '../../services/global/api-settings.shared.service';
import { makeParamDecorator } from '@angular/core/src/util/decorators';

@Injectable()
export class RatecardManagerService {
    url: string;

    constructor(
        private _http: Http,
        private _apiSettings: ApiSettingsSharedService
    ) {
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

    // // ? get profile
    // get_profileByToCarrier(carrierId: number): Observable<any> {
    //     return this._http
    //         .get(this.url + carrierId)
    //         .pipe (
    //             map(res => res.json()),
    //             catchError(this.handleError)
    //         );
    // }

    // // ? post<store> profile
    // post_profileByToCarrier(carrierId: number, body: any): Observable<any> {
    //     return this._http
    //         .post(this.url + carrierId, body)
    //         .pipe (
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
