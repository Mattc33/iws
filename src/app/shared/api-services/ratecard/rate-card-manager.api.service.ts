import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ApiSettingsSharedService } from '../../services/global/api-settings.shared.service';
import { makeParamDecorator } from '../../../../../node_modules/@angular/core/src/util/decorators';

@Injectable()
export class RatecardManagerService {
    url: string;

    constructor(
        private _http: Http,
        private _apiSettings: ApiSettingsSharedService
    ) {
        this.url = this._apiSettings.getUrl();
    }

    // ? get profile
    get_profileByToCarrier(carrierId: number): Observable<any> {
        return this._http
            .get(this.url + carrierId)
            .pipe (
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    // ? post<store> profile
    post_profileByToCarrier(carrierId: number, body: any): Observable<any> {
        return this._http
            .post(this.url + carrierId, body)
            .pipe (
                catchError(this.handleError)
            )
    }

    // ? get a list of ratecards by carrierId
    // filter for active, filter for standard or premium
    get_listOfRatecards(carrierId: number, productTier: string): Observable<any> {
        return this._http
            .get(this.url + carrierId + '/?active=1' + `&ratecard_tier=${productTier}`)
            .pipe (
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    // ? get a specific ratecard with nested rates array with iso code 
    // as the key and the prefixes as a value of array containing prefixes
    get_ratecardWithRatesByCountry(carrierId: number, ratecardId: number): Observable<any> {
        return this._http
            .get(this.url + carrierId + '/' + ratecardId + '/?active=1')
            .pipe (
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    handleError(error: any): any {
        console.error(error);
    }
}
