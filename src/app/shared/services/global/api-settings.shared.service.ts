import { Injectable } from '@angular/core';

@Injectable()
export class ApiSettingsSharedService {

    getUrl = (): string => 'http://172.20.13.129:8943/';

    // ! Refactor this to present a global message/snackbar to the user
    handleError = (error: Error) => console.log(error);

}
