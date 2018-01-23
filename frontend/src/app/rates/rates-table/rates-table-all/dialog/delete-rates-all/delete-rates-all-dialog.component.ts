import { Component, Inject, OnInit, AnimationKeyframe, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RatesTableAllComponent } from '../../../rates-table-all/rates-table-all.component';

import { RatesService } from '../../../../services/rates.api.service';
import { RatesSharedService } from '../../../../services/rates.shared.service';

@Component({
    selector: 'app-del-rates-all-dialog',
    templateUrl: './delete-rates-all-dialog.component.html',
    styleUrls: ['./delete-rates-all-dialog.component.scss'],
    providers: [ RatesService ],
  })
  export class DeleteAllRatesDialogComponent implements OnInit {

    event_onDel = new EventEmitter;

    addCarrierFormGroup: FormGroup;
    allRatesRowObj;

    constructor(
      public dialogRef: MatDialogRef <RatesTableAllComponent>,
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
        let rowId: number;
        for( let i = 0; i < this.allRatesRowObj.length; i++) {
            rowId = this.allRatesRowObj[i].id;
            this.ratesService.del_Rates(rowId)
                .subscribe(resp => console.log(resp));
        }
    }

    // On method call close dialog
    closeDialog(): void {
      this.dialogRef.close();
    }

  }
