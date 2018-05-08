import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';

import { CarrierTableComponent } from './../../carrier-table.component';

import { CarrierService } from '../../../services/carrier.api.service';
import { CarrierSharedService } from './../../../services/carrier.shared.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
    selector: 'app-add-carrier-dialog-inner',
    templateUrl: './add-carrier-dialog.component.html',
    styleUrls: ['./add-carrier-dialog.component.scss']
  })
export class AddCarrierDialogComponent implements OnInit {

    // Form Group
    private addCarrierFormGroup: FormGroup;

    // Input Props
    private taxableOptions = [
        {value: false, viewValue: 'No'},
        {value: true, viewValue: 'Yes'},
    ];
    private tierOptions = [
        {value: 1, viewValue: 'Tier 1'},
        {value: 2, viewValue: 'Tier 2'},
        {value: 3, viewValue: 'Tier 3'},
        {value: 4, viewValue: 'Tier 4'},
        {value: 5, viewValue: 'Tier 5'},
    ];

    // Service Props
    private finalCarrierObj;

    constructor(
        public dialogRef: MatDialogRef <CarrierTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private carrierService: CarrierService,
        private snackbarSharedService: SnackbarSharedService
    ) {}

    ngOnInit() {
        this.addCarrierFormGroup = this.formBuilder.group({
            nameCtrl: ['', Validators.required],
            emailCtrl: ['', [Validators.required, Validators.email]],
            addressCtrl: ['', Validators.required],
            phoneCtrl: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            taxableCtrl: ['', Validators.required],
            tierCtrl: ['', Validators.required],
            codeCtrl: ['', [Validators.required, Validators.pattern('[A-Z]{3}')]]
        });
    }

    /*
        ~~~~~~~~~~ Services ~~~~~~~~~~
    */
    post_addCarrier(body) {
        this.carrierService.post_AddRow(body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Carrier successfully inserted.', 2000);
                    }
                },
                error => {
                    console.log(error);
                        this.snackbarSharedService.snackbar_error('Carrier failed to insert.', 2000);
                }
            );
    }

    /*
        ~~~~~~~~~~ Form Obj from Input ~~~~~~~~~~
    */
    formCarrierObj() {
        this.finalCarrierObj = {
            code: this.addCarrierFormGroup.get('codeCtrl').value,
            name: this.addCarrierFormGroup.get('nameCtrl').value,
            email: this.addCarrierFormGroup.get('emailCtrl').value,
            phone: this.addCarrierFormGroup.get('phoneCtrl').value,
            address: this.addCarrierFormGroup.get('addressCtrl').value,
            taxable: this.addCarrierFormGroup.get('taxableCtrl').value,
            tier: this.addCarrierFormGroup.get('tierCtrl').value
        };
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    click_addCarrier(post) {
        this.post_addCarrier(this.finalCarrierObj);
        this.closeDialog();
    }

    closeDialog(): void {
      this.dialogRef.close();
    }

}
