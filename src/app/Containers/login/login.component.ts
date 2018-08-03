import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// import { LoginService } from '../../shared/api-services/login/login.api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    constructor(
        private _fb: FormBuilder,
        // private _login: LoginService
    ) {
    }

    ngOnInit() {
        this.loginForm = this._fb.group(
            {
                userName: [ null, [ Validators.required ] ],
                password: [ null, [ Validators.required ] ],
                remember: [ true ]
            }
        );
    }

    // submitForm(): void {
    //     const body = {
    //         'subscriber_login': '19143493981',
    //         'subscriber_password': 'scorpio1988',
    //          'devicemeta': {
    //             'language': 'en',
    //             'os_name': 'web',
    //             'os_version': 'string'
    //         }
    //     };
    //     this._login.get_authentication(body)
    //         .subscribe(
    //             resp => console.log(resp)
    //         );
    // }

}
