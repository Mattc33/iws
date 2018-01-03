import { Component, Inject, OnInit, AnimationKeyframe } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CarrierService } from '../../services/carrier.service';
import { TableService } from '../../services/table.service';
import { CarrierUiComponent } from './../../carrier-ui/carrier-ui.component';

@Component({
    selector: 'app-add-carrier-dialog-inner',
    templateUrl: './add-carrier-dialog.component.html',
    styleUrls: [],
    providers: [ CarrierService ],
  })
export class AddCarrierDialogComponent implements OnInit {

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

  post: any;
  carrierObj = {};

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

  constructor(public dialogRef: MatDialogRef <CarrierUiComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private carrierService: CarrierService, private tableService: TableService) {}

  ngOnInit() {
    this.tableService.currentCarrierObj.subscribe( receivedCarrierObj => this.carrierObj = receivedCarrierObj );
  }

  // POST method, sending carrier info to server
  addCarrier(post) {
    const carrierModel = {
        code: post.code,
        name: post.name,
        email: post.email,
        phone: post.phone,
        address: post.address,
        taxable: post.taxable,
        tier: post.tier,
    };

    // Send carrierObj to shared service for table component
    this.tableService.changeCarrierObj(carrierModel);

    // send to carrier service as http
    this.carrierService.postAddRow(carrierModel)
      .subscribe(result => console.log(result));
    }

    // On method call close dialog
    onNoClick(): void {
      this.dialogRef.close();
    }

    // Validation Handling
    on_getErrorNameMessage() {
      return this.addCarrierFormGroup.get('name').hasError('required') ? 'You must enter a Name' :
      '';
    }

    on_getErrorEmailMessage() {
      return this.addCarrierFormGroup.get('email').hasError('required') ? 'You must enter an Email' :
      this.addCarrierFormGroup.get('email').hasError('pattern') ? 'Not a valid Email' :
      '';
    }

    on_getErrorAddressMessage() {
      return this.addCarrierFormGroup.get('address').hasError('required') ? 'You must enter a Address' :
      '';
    }

    on_getErrorPhoneMessage() {
      return this.addCarrierFormGroup.get('phone').hasError('required') ? 'You must enter a Phone Number' :
      '';
    }

    on_getErrorCodeMessage() {
      return this.addCarrierFormGroup.get('code').hasError('required') ? 'You must enter a Code' :
      this.addCarrierFormGroup.get('code').hasError('pattern') ? 'Not a valid 2 character Code' :
      '';
    }
  }
