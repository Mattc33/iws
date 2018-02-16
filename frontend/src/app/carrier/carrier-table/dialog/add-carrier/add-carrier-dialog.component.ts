import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CarrierTableComponent } from './../../carrier-table.component';

import { CarrierService } from '../../../services/carrier.api.service';
import { CarrierSharedService } from './../../../services/carrier.shared.service';

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

    // Pattern
    private emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+';
    // phonePattern = '^[0-9]+$';
    private taxablePattern = '^[0-1]+$';
    private codePattern = '^[a-zA-Z0-9]{3}';

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
        private carrierService: CarrierService
    ) {}

    ngOnInit() {
        this.addCarrierFormGroup = this.formBuilder.group({
            nameCtrl: ['', Validators.required],
            emailCtrl: ['', Validators.required, Validators.pattern(this.emailPattern)],
            addressCtrl: ['', Validators.required],
            phoneCtrl: ['', Validators.required],
            taxableCtrl: ['', Validators.required],
            tierCtrl: ['', Validators.required],
            codeCtrl: ['', Validators.required, Validators.pattern(this.codePattern)]
        })
    }

    click_addCarrier(post) {
        this.finalCarrierObj = {
            code: this.addCarrierFormGroup.get('codeCtrl').value,
            name: this.addCarrierFormGroup.get('nameCtrl').value,
            email: this.addCarrierFormGroup.get('emailCtrl').value,
            phone: this.addCarrierFormGroup.get('phoneCtrl').value,
            address: this.addCarrierFormGroup.get('addressCtrl').value,
            taxable: this.addCarrierFormGroup.get('taxableCtrl').value,
            tier: this.addCarrierFormGroup.get('tierCtrl').value
        };

        this.aggrid_addCarrier(this.finalCarrierObj);
        this.post_addCarrier(this.finalCarrierObj);

        this.closeDialog();
    }

    post_addCarrier(body) {
        this.carrierService.post_AddRow(body)
            .subscribe(resp => console.log(resp));
    }

    aggrid_addCarrier(body) {
        this.event_onAdd.emit(body);
    }

    closeDialog(): void {
      this.dialogRef.close();
    }
}
