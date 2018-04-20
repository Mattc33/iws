import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ImporterSharedService } from './importer.shared.service';
import { ApiSettingsSharedService } from './../../global-service/api-settings.shared.service';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class ImporterService {
    private url: string;
    private headers: Headers;
    private options: RequestOptions;

    constructor(
        private http: Http,
        private importerSharedService: ImporterSharedService,
        private apiSettingsSharedService: ApiSettingsSharedService
    ) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
        this.url = this.apiSettingsSharedService.getUrl();
    }

    post_AddRateCard(body: any): Observable<any> {
        return this.http.post(this.url + 'ratecards/', body)
            .map(res => res.json())
            .catch(this.handleError)
            .do(res => { this.importerSharedService.changePostTableObj(res); }); // Send post res to shared service
    }

    put_EditRates(ratesId: number, body: any): Observable<any> {
        return this.http.put(this.url + 'rates/' + ratesId, body)
            .map(res => res.json())
            .catch(this.handleError)
            .do(res => console.log('server data', res));
    }

    put_EditTeleUDatabase(teleuId: number, body: object): Observable<any> {
        return this.http.put(this.url + 'teleu/rate/' + teleuId, body)
            .map(res => res.json())
            .catch(this.handleError)
            .do(res => console.log('server data', res));
    }

    get_CarrierNames(): Observable<any> {
        return this.http.get(this.url + 'carriers/')
            .map(res => res.json())
            .catch(this.handleError)
            .do(res => console.log('server data', res));
        }

    handleError(error: any): any {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
