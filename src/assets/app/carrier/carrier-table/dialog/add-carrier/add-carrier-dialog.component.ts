import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CarrierTableComponent } from './../../carrier-table.component';

import { CarrierService } from './../../../../shared/api-services/carrier/carrier.api.service';
import { CarrierSharedService } from './../../../../shared/services/carrier/carrier.shared.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
    selector: 'app-add-carrier-dialog-inner',
    templateUrl: './add-carrier-dialog.component.html',
    styleUrls: ['./add-carrier-dialog.component.scss']
  })
export class AddCarrierDialogComponent implements OnInit {

    // * Form Group
    addCarrierFormGroup: FormGroup;

    // * Input Props
    taxableOptions = [
        {value: false, viewValue: 'No'},
        {value: true, viewValue: 'Yes'},
    ];
    tierOptions = [
        {value: 1, viewValue: 'Tier 1'},
        {value: 2, viewValue: 'Tier 2'},
        {value: 3, viewValue: 'Tier 3'},
        {value: 4, viewValue: 'Tier 4'},
        {value: 5, viewValue: 'Tier 5'},
    ];

    constructor(
        public _dialogRef: MatDialogRef <CarrierTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _carrierService: CarrierService,
        private _snackbarSharedService: SnackbarSharedService
    ) {}

    ngOnInit() {
        this.addCarrierFormGroup = this.generateAddCarrierForm();
    }

    // ================================================================================
    // * Carrier API Services
    // ================================================================================
    post_addCarrier = body => {
        this._carrierService.post_AddRow(body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbarSharedService.snackbar_success('Carrier successfully inserted.', 2000);
                    }
                },
                error => {
                    console.log(error);
                        this._snackbarSharedService.snackbar_error('Carrier failed to insert.', 2000);
                }
            );
    }

    // ================================================================================
    // * Form Group & Data
    // ================================================================================
    generateAddCarrierForm = () => {
        return this._formBuilder.group({
            nameCtrl: ['', Validators.required],
            emailCtrl: ['', [Validators.required, Validators.email]],
            addressCtrl: ['', Validators.required],
            phoneCtrl: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            taxableCtrl: ['', Validators.required],
            tierCtrl: ['', Validators.required],
            codeCtrl: ['', [Validators.required, Validators.pattern('[A-Z]{3}')]]
        });
    }

    formCarrierObj = () => {
        return {
            code: this.addCarrierFormGroup.get('codeCtrl').value,
            name: this.addCarrierFormGroup.get('nameCtrl').value,
            email: this.addCarrierFormGroup.get('emailCtrl').value,
            phone: this.addCarrierFormGroup.get('phoneCtrl').value,
            address: this.addCarrierFormGroup.get('addressCtrl').value,
            taxable: this.addCarrierFormGroup.get('taxableCtrl').value,
            tier: this.addCarrierFormGroup.get('tierCtrl').value
        };
    }

    // ================================================================================
    // * Dialog
    // ================================================================================
    click_addCarrier = (): void => {
        this.post_addCarrier(this.formCarrierObj());
        this.closeDialog();
    }

    closeDialog = (): void => {
      this._dialogRef.close();
    }

}
