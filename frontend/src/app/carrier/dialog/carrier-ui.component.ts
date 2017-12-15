import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CarrierService } from '../services/carrier.service';

@Component({
  selector: 'app-carrier-ui',
  templateUrl: './carrier-ui.component.html',
  styleUrls: ['./carrier-ui.component.scss']
})

export class CarrierUiComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddCarrierDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

/* Dialog component */
@Component({
    selector: 'app-add-carrier-dialog-inner',
    templateUrl: './add-carrier-dialog.inner.html',
    providers: [ CarrierService ],
  })
export class AddCarrierDialogComponent {

  addCarrierFormGroup: FormGroup;
  post: any;

  constructor(
    public dialogRef: MatDialogRef <CarrierUiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private carrierService: CarrierService,
    private formBuilder: FormBuilder,
  ) {
      this.addCarrierFormGroup = formBuilder.group({
        name: [null, Validators.required],
        email: [null, Validators.required],
        address: [null, Validators.required],
        phone_number: [null, Validators.required],
        taxable: [null, Validators.required],
        tier_number: [null, Validators.required],
        two_digit_code: [null, Validators.required],
      });
    }

  // POST method, sending carrier info to server
  addCarrier(post) {
    const body = {
      name: post.name,
      email: post.email,
      address: post.address,
      phone_number: post.phone_number,
      taxable: post.taxable,
      tier_number: post.tier_number,
      two_digit_code: post.two_digit_code,
    };

    this.carrierService.postAddRow(body)
      .subscribe(result => console.log(result));
  }

  // On method call close dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

}
