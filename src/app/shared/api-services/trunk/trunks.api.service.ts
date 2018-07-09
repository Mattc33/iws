import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

import { ApiSettingsSharedService } from '../../services/global/api-settings.shared.service';

@Injectable()
export class TrunksService {
    private url: string;
    private headers: Headers;
    private options: RequestOptions;

    constructor(
        private _http: Http,
        private _apiSettings: ApiSettingsSharedService
    ) {
        this.url = this._apiSettings.getUrl();
    }

    get_allTrunks(): Observable<any> {
        return this._http
            .get(this.url + 'trunks')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    get_specificTrunk(trunkId: number): Observable<any> {
        return this._http
            .get(this.url + 'trunks/' + trunkId)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    post_addTrunk(body: any): Observable<any> {
        return this._http
            .post(this.url + 'trunks', body)
            .pipe(
                catchError(this.handleError)
            );
    }

    del_deleteTrunk(trunkId: number): Observable<any> {
        return this._http
            .delete(this.url + 'trunks/' + trunkId)
            .pipe(
                catchError(this.handleError)
            );
    }

    put_editTrunk(trunkId: number, body): Observable<any> {
        return this._http
            .put(this.url + 'trunks/' + trunkId, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    handleError(error: any): any {
        console.error(error);
    }
}
