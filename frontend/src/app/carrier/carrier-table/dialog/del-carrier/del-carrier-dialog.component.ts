import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CarrierTableComponent } from './../../carrier-table.component';

import { CarrierService } from '../../../services/carrier.api.service';
import { CarrierSharedService } from '../../../services/carrier.shared.service';

@Component({
    selector: 'app-del-carrier-dialog-inner',
    templateUrl: './del-carrier-dialog.component.html',
    providers: [ CarrierService ],
  })
  export class DelCarrierDialogComponent implements OnInit {

    event_onDel = new EventEmitter;

    addCarrierFormGroup: FormGroup;
    rowID: number;

    constructor(
      public dialogRef: MatDialogRef <CarrierTableComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private carrierService: CarrierService,
      private carrierSharedService: CarrierSharedService,
    ) {
    }

    ngOnInit() {
      this.carrierSharedService.currentRowID.subscribe(receivedRowID => this.rowID = receivedRowID);
    }

    click_delCarrier() {
      console.log('--->  ' + this.rowID);
      this.del_delCarrier();
      this.aggrid_delRateCard();

      this.closeDialog();
    }

    aggrid_delRateCard() {
      this.event_onDel.emit(true);
    }

    del_delCarrier() {
      this.carrierService.del_DeleteRow(this.rowID)
        .subscribe(resp => console.log(resp));
    }

    // On method call close dialog
    closeDialog(): void {
      this.dialogRef.close();
    }

  }
