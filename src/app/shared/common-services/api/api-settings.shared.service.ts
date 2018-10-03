export class ApiSettingsSharedService {

    static getUrl = (): string => 'http://18.221.27.121:8943' // AWS HOST
    // static getUrl = (): string => 'http://172.20.13.129:8943' // Local HOST

    static getLoginUrl = (): string => 'https://api.obie-x.com/obietel/'

    // ! Refactor this to present a global message/snackbar to the user
    static handleError = (error: Error) => console.log(error)
}
