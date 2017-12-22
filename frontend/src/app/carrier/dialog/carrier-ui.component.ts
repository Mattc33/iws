import { Component, Inject, OnInit, AnimationKeyframe } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CarrierService } from '../services/carrier.service';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-carrier-ui',
  templateUrl: './carrier-ui.component.html',
  styleUrls: ['./carrier-ui.component.scss'],
})

export class CarrierUiComponent implements OnInit {

  rowID: number;

  constructor(private tableService: TableService, public dialog: MatDialog ) {}

  ngOnInit() {
    this.tableService.currentRowID.subscribe(receivedRowID => this.rowID = receivedRowID);
  }

  openDialogAdd(): any {
    const dialogRef = this.dialog.open(AddCarrierDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  } // end openDialogAdd

  openDialogDel(): any {
    const dialogRef = this.dialog.open(DelCarrierDialogComponent, {
      data: { rowID: this.rowID },
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }// end openDialogDel

}

/*
Dialog component
addCarrier
*/
@Component({
    selector: 'app-add-carrier-dialog-inner',
    templateUrl: './add-carrier-dialog.inner.html',
    styleUrls: ['./carrier-ui.component.scss'],
    providers: [ CarrierService ],
  })
export class AddCarrierDialogComponent implements OnInit {

  namePattern = '^[a-zA-Z]+$';
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+';
  //phonePattern = '^[0-9]+$';
  taxablePattern = '^[0-1]+$';
  codePattern = '^[a-zA-Z0-9]{2}';

  taxableOptions = [
    {value: 0, viewValue: 'No'},
    {value: 1, viewValue: 'Yes'},
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
    name: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
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
    const form_carrierObj = {
      code: post.code,
      name: post.name,
      email: post.email,
      phone: post.phone,
      address: post.address,
      taxable: post.taxable,
      tier: post.tier,
    };

    // Send carrierObj to shared service
    this.tableService.changeCarrierObj(form_carrierObj);

    // send to carrier service as http
    this.carrierService.postAddRow(form_carrierObj)
      .subscribe(result => console.log(result));
    }

    // On method call close dialog
    onNoClick(): void {
      this.dialogRef.close();
    }

    // Validation Handling
    on_getErrorNameMessage() {
      return this.addCarrierFormGroup.get('name').hasError('required') ? 'You must enter a Name' :
      this.addCarrierFormGroup.get('name').hasError('pattern') ? 'Not a valid Name' :
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

/*
Dialog component
delCarrier
*/
@Component({
  selector: 'app-del-carrier-dialog-inner',
  templateUrl: './del-carrier-dialog.inner.html',
  providers: [ CarrierService ],
})
export class DelCarrierDialogComponent implements OnInit {

  addCarrierFormGroup: FormGroup;
  post: any;

  ifDialog: number;

  constructor(
    public dialogRef: MatDialogRef <CarrierUiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private carrierService: CarrierService,
    private tableService: TableService,
  ) {
  }

  ngOnInit() {
    this.tableService.currentIfDialog.subscribe(receivedRowID => this.ifDialog = receivedRowID);
  }

  delCarrier() {
    console.log(this.data.rowID);

    const body = {
      id: this.data.rowID,
    };

    if (this.data.rowID !== 0) {
      // subscribe to carrier service del rout+e
      this.carrierService.delDeleteRow(body)
        .subscribe(result => console.log(result));

      // pass 1 true to carrier-table for row deletion
      this.tableService.changeIfDialog(1);
    } else {
      return;
    }
  }

  // On method call close dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

}
