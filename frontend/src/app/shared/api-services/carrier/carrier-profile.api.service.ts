import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { ApiSettingsSharedService } from './../../services/global/api-settings.shared.service';

@Injectable()
export class CarrierProfileService {

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

    get_carrierProfiles(): Observable<any> {
        return this._http
            .get(this.url + 'carrierProfiles/') // ! .
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    handleError(error: any): any {
        console.error(error);
    }
}
