import { Injectable }                           from '@angular/core'
import { Http, Headers, RequestOptions }        from '@angular/http'
import { Observable }                           from 'rxjs'
import { map, catchError}                       from 'rxjs/operators'
import { ApiSettingsSharedService }             from '../../common-services/api/api-settings.shared.service'

@Injectable()
export class CarrierService {

    private url
    private headers: Headers
    private options: RequestOptions

    constructor(
        private _http: Http
    ) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' })
        this.options = new RequestOptions({ headers: this.headers })
        this.url = ApiSettingsSharedService.getUrl()
    }

    get_carriers(): Observable<any> {
        return this._http
            .get(this.url + '/carriers/')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            )
    }

    post_AddRow(body: any): Observable<any> {
        return this._http
            .post(this.url + '/carriers/', body, this.options)
            .pipe(
                catchError(this.handleError)
            )
    }

    del_DeleteRow(rowId: any): Observable<any> {
        return this._http
            .delete(this.url + '/carriers/' + rowId)
            .pipe(
                catchError(this.handleError)
            )
    }

    put_EditCarrier(body: any, rowId: number): Observable<any> {
        return this._http
            .put(this.url + '/carriers/' + rowId, body)
            .pipe(
                catchError(this.handleError)
            )
    }

    handleError(error: any): any {
        console.error(error)
    }
}
