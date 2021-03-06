import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ImporterSharedService } from '../../services/ratecard/importer.shared.service';
import { ApiSettingsSharedService } from '../../services/global/api-settings.shared.service';

@Injectable()
export class ImporterService {
    private url: string;
    private headers: Headers;
    private options: RequestOptions;

    constructor(
        private _http: Http,
        private _importer: ImporterSharedService,
        private _apiSettings: ApiSettingsSharedService
    ) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }

    post_AddRateCard(body: any): Observable<any> {
        return this._http
            .post(this.url + 'ratecards/', body)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError),
                 // * performs a side effect, but still returns observable, storing imported rate card for later
                tap(res => { this._importer.changePostTableObj(res); })
            );
    }

    put_EditRates(ratesId: number, body: any): Observable<any> {
        return this._http
            .put(this.url + 'rates/' + ratesId, body)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    put_EditTeleUDatabase(teleuId: number, body: object): Observable<any> {
        return this._http
            .put(this.url + 'teleu/rate/' + teleuId, body)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    handleError(error: any): any {
        console.error(error);
    }

}
