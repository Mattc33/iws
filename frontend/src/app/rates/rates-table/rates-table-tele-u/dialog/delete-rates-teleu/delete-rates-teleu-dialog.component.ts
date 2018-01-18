import { Component, Inject, OnInit, AnimationKeyframe, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RatesTableTeleUComponent } from '../../../rates-table-tele-u/rates-table-tele-u.component';

import { RatesService } from '../../../../services/rates.api.service';
import { RatesSharedService } from '../../../../services/rates.shared.service';

@Component({
    selector: 'app-del-rates-all-dialog',
    templateUrl: './delete-rates-teleu-dialog.component.html',
    providers: [ RatesService ],
  })
  export class DeleteTeleuRatesDialogComponent implements OnInit {

    event_onDel = new EventEmitter;

    addCarrierFormGroup: FormGroup;
    allRatesRowObj: object;

    constructor(
      public dialogRef: MatDialogRef <RatesTableTeleUComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private ratesService: RatesService,
      private ratesSharedService: RatesSharedService
    ) {}

    ngOnInit() {
      this.ratesSharedService.currentAllRowObj.subscribe( receivedRowObj => this.allRatesRowObj = receivedRowObj );
    }

    click_delRateCard() {
      console.log(this.allRatesRowObj);
      this.aggrid_delRateCard();
      this.del_delCarrier();
      this.closeDialog();
    }

    aggrid_delRateCard() {
      this.event_onDel.emit(true);
    }

    del_delCarrier() {
      this.ratesService.del_Rates(this.allRatesRowObj[0].id)
        .subscribe(resp => console.log(resp));
    }

    // On method call close dialog
    closeDialog(): void {
      this.dialogRef.close();
    }

  }
