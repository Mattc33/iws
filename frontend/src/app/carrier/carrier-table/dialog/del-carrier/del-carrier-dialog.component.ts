import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CarrierTableComponent } from './../../carrier-table.component';

import { CarrierService } from '../../../services/carrier.api.service';
import { CarrierSharedService } from '../../../services/carrier.shared.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
    selector: 'app-del-carrier-dialog-inner',
    templateUrl: './del-carrier-dialog.component.html',
    styleUrls: ['./del-carrier-dialog.component.scss'],
    providers: [ CarrierService ],
  })
  export class DelCarrierDialogComponent implements OnInit {

    // event
    event_onDel = new EventEmitter;

    // Internal Service props
    private rowObj;

    constructor(
        public dialogRef: MatDialogRef <CarrierTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private carrierService: CarrierService,
        private carrierSharedService: CarrierSharedService,
        private snackbarSharedService: SnackbarSharedService
    ) {}

    ngOnInit() {
        this.carrierSharedService.currentRowObj.subscribe(receivedRowID => this.rowObj = receivedRowID);
    }

    /*
        ~~~~~~~~~~ API Service ~~~~~~~~~~
    */
    del_carrier(rowId: number) {
        this.carrierService.del_DeleteRow(rowId)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Carrier successfully deleted.', 5000);
                    }
                },
                error => {
                    console.log(error);
                        this.snackbarSharedService.snackbar_error('Carrier failed to delete.', 5000);
                }
            );
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    click_delCarrier() {
        this.del_multipleCarriers();
        this.aggrid_delRateCard();
        this.closeDialog();
    }

    del_multipleCarriers() {
        let rowId: number;
        for ( let i = 0; i < this.rowObj.length; i++) {
            rowId = this.rowObj[i].id;
            this.del_carrier(rowId);
        }
    }

    aggrid_delRateCard() {
        this.event_onDel.emit(true);
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

}
