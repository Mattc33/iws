import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';

import { CarrierTableComponent } from './../../carrier-table.component';

import { CarrierService } from '../../../services/carrier.api.service';
import { CarrierSharedService } from './../../../services/carrier.shared.service';
import { SnackbarSharedService } from './../../../../global-service/snackbar.shared.service';

/* Error when invalid control is dirty, touched, or submitted. */
export class CarrierErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-add-carrier-dialog-inner',
    templateUrl: './add-carrier-dialog.component.html',
    styleUrls: ['./add-carrier-dialog.component.scss'],
    providers: [ CarrierService ],
  })
export class AddCarrierDialogComponent implements OnInit {

    event_onAdd = new EventEmitter;

    // Form Group
    private addCarrierFormGroup: FormGroup;

    // Validation
    private taxablePattern = '^[0-1]+$';
    private codePattern = '^[a-zA-Z0-9]{3}';
    private matcher = new CarrierErrorStateMatcher();

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
                resp => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Carrier successfully inserted.', 5000);
                    } else {
                        alert(resp);
                    }
                },
                err => {console.log(err); }
            );
    }

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

    click_addCarrier(post) {
        this.aggrid_addCarrier(this.finalCarrierObj);
        this.post_addCarrier(this.finalCarrierObj);

        this.closeDialog();
    }

    aggrid_addCarrier(body) {
        this.event_onAdd.emit(body);
    }

    closeDialog(): void {
      this.dialogRef.close();
    }

    /*
        ~~~~~~~~~~ snackbar ~~~~~~~~~~~
    */


}
