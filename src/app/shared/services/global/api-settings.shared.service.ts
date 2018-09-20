import { Injectable } from '@angular/core';

@Injectable()
export class ApiSettingsSharedService {

    getUrl = (): string => 'http://18.221.27.121:8943/'

    getLoginUrl = (): string => 'https://api.obie-x.com/obietel/'

    // ! Refactor this to present a global message/snackbar to the user
    handleError = (error: Error) => console.log(error);

}
