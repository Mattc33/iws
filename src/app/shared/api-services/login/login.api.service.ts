import { Injectable }                           from '@angular/core'
import { Http, Headers, RequestOptions }        from '@angular/http'
import { Observable }                           from 'rxjs'
import { map, catchError }                      from 'rxjs/operators'

import { ApiSettingsSharedService }             from '../../common-services/api/api-settings.shared.service'


@Injectable()
export class LoginService {

    url: string
    headers: Headers
    options: RequestOptions

    X_Application_ID = 'BF3E86D03C63053271B1E6C8582464D4'
    X_Device_ID = 'web'

    constructor(
        private _apiSettings: ApiSettingsSharedService,
        private _http: Http
    ) {
        this.headers = new Headers(
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-application-id': this.X_Application_ID,
                'x-device-id': this.X_Device_ID
            }
        );
        this.options = new RequestOptions({ headers: this.headers })
        this.url = ApiSettingsSharedService.getLoginUrl()
    }

    get_authentication(body: object): Observable<any> {
        return this._http
            .post(this.url + '/auth', body, this.options)
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            )
    }

    get_subscribe(accountId: number, token: string): Observable<any> {
        return this._http
            .get(this.url + '/subscriber/' + accountId)
    }

    handleError(error: any): any {
        console.error(error)
    }

}
