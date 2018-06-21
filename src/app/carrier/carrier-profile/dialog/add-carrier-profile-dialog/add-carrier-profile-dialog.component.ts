import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { CarrierProfileComponent } from './../../carrier-profile.component';
import { CarrierProfileService } from './../../../../shared/api-services/carrier/carrier-profile.api.service';
import { CarrierService } from './../../../../shared/api-services/carrier/carrier.api.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
  selector: 'app-add-carrier-profile-dialog',
  templateUrl: './add-carrier-profile-dialog.component.html',
  styleUrls: ['./add-carrier-profile-dialog.component.scss']
})
export class AddCarrierProfileDialogComponent implements OnInit {

    // * Form Group
    private addCarrierProfileFormGroup: FormGroup;

    // * Props
    private carrierObj;
    private profilePreviewObj = {};

    constructor(
        public _dialogRef: MatDialogRef <CarrierProfileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _carrierSerivce: CarrierService,
        private _snackbarSharedService: SnackbarSharedService,
        private _carrierProfileService: CarrierProfileService
    ) { }

    ngOnInit() {
        this.get_carriers();
        this.addCarrierProfileFormGroup = this.generateAddCarrierProfileFormGroup();
    }

    // ================================================================================
    // * Carrier Profile API Services
    // ================================================================================
    get_carriers() {
        this._carrierSerivce.get_carriers()
            .subscribe(
                data => {
                    console.log(data);
                    this.carrierObj = data;
                },
            );
    }

    post_addCarrierProfile(body) {
        this._carrierProfileService.get_carrierProfiles()
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbarSharedService.snackbar_success('Carrier Profile successfully inserted.', 2000);
                    }
                },
                error => {
                    console.log(error);
                        this._snackbarSharedService.snackbar_error('Carrier Profile failed to insert.', 2000);
                }
            );
    }

    // ================================================================================
    // * Form Group & Data
    // ================================================================================
    generateAddCarrierProfileFormGroup() {
        return this._formBuilder.group({
            carrierNameCtrl: [Validators.required],
            carrierCodeCtrl: [Validators.required],
            profileNameCtrl: ['', Validators.required]
        });
    }

    formCarrierProfileObj() {
        return {
            carrier_name: this.getCarrierName(),
            carrier_code: this.getCarrierCode(),
            profile_name: this.getProfileName(),
            rowsFromTop: 0,
            rowsFromBottom: 0,
            colOfDest: 0,
            colOfPrefix: 0,
            colOfRates: 0
        };
    }

    formCarrierProfilePreview() {
        this.profilePreviewObj = this.formCarrierProfileObj();
    }

    getCarrierName = () =>  this.addCarrierProfileFormGroup.get('carrierNameCtrl').value;

    getCarrierCode = () => {
        for (let i = 0; this.carrierObj.length; i++) {
            if ( this.carrierObj[i].name === this.getCarrierName() ) {
                return this.carrierObj[i].code;
            }
        }
    }

    getProfileName = () => this.addCarrierProfileFormGroup.get('profileNameCtrl').value;

    // ================================================================================
    // * Dialog
    // ================================================================================
    click_generateProfilePreview() {
        // this.formCarrierProfileObj();
        this.formCarrierProfilePreview();
    }

    click_sendProfileReq(post) {
        this.post_addCarrierProfile(this.formCarrierProfileObj());
        this.closeDialog();
    }

    closeDialog(): void {
        this._dialogRef.close();
    }

}
