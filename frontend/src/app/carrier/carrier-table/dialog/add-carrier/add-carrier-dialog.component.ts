import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CarrierTableComponent } from './../../carrier-table.component';

import { CarrierService } from '../../../services/carrier.api.service';

@Component({
    selector: 'app-add-carrier-dialog-inner',
    templateUrl: './add-carrier-dialog.component.html',
    styleUrls: [],
    providers: [ CarrierService ],
  })
export class AddCarrierDialogComponent {

  event_onAdd = new EventEmitter;

  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+';
  // phonePattern = '^[0-9]+$';
  taxablePattern = '^[0-1]+$';
  codePattern = '^[a-zA-Z0-9]{2}';

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

  // Form controllers
  addCarrierFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    address: new FormControl('', [Validators.required]),
    // tslint:disable-next-line:max-line-length
    phone: new FormControl('', [Validators.required]),
    taxable: new FormControl('', [Validators.required]),
    tier: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required, Validators.pattern(this.codePattern)])
  });

  constructor(public dialogRef: MatDialogRef <CarrierTableComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private carrierService: CarrierService) {}

  click_addCarrier(post) {
    const carrierModel = {
        code: post.code,
        name: post.name,
        email: post.email,
        phone: post.phone,
        address: post.address,
        taxable: post.taxable,
        tier: post.tier
    };

    console.log(carrierModel);

    this.aggrid_addCarrier(carrierModel);
    this.post_addCarrier(carrierModel);

    this.closeDialog();
  }

    post_addCarrier(body) {
        this.carrierService.post_AddRow(body)
            .subscribe(resp => console.log(resp));
    }

    aggrid_addCarrier(body) {
        this.event_onAdd.emit(body);
    }

    // On method call close dialog
    closeDialog(): void {
      this.dialogRef.close();
    }
}
