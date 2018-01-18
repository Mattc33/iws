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
    private addCarrierFormGroup: FormGroup;
    
    private rowObj;

    constructor(
        public dialogRef: MatDialogRef <CarrierTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private carrierService: CarrierService,
        private carrierSharedService: CarrierSharedService,
    ) {}

    ngOnInit() {
        this.carrierSharedService.currentRowObj.subscribe(receivedRowID => this.rowObj = receivedRowID);
    }

    click_delCarrier() {
        console.log(this.rowObj);
        this.del_delCarrier();
        this.aggrid_delRateCard();

        this.closeDialog();
    }

    aggrid_delRateCard() {
        this.event_onDel.emit(true);
    }

    del_delCarrier() {
        let rowId: number;
        for( let i = 0; i < this.rowObj.length; i++) {
            rowId = this.rowObj[i].id;
            this.carrierService.del_DeleteRow(rowId)
                .subscribe(resp => console.log(resp));
        }
    }

    // On method call close dialog
    closeDialog(): void {
        this.dialogRef.close();
    }

  }
