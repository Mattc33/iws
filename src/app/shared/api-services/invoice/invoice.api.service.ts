import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

@Injectable()
export class InvoiceService {

    private headers: Headers;
    private options: RequestOptions;

    constructor(
        private _http: Http
    ) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    get_prefixLookup(): Observable<any> {
        return this._http
            .get('https://raw.githubusercontent.com/Mattc33/MattsCDN/master/json/comparatorArr.json')
            .pipe(
                map(res => res.json()),
                catchError(this.handleError)
            );
    }

    handleError(error: any): any {
        console.error(error);
    }
}
