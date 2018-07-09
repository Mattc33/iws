import { Injectable } from '@angular/core';

@Injectable()
export class ApiSettingsSharedService {

    getUrl(): string {
        const url = 'http://172.20.13.129:8943/';
        return url;
    }

}
