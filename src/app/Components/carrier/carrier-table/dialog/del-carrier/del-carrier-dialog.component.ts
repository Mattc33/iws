import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CarrierTableComponent } from '../../carrier-table.component';

import { CarrierService } from '../../../../../shared/api-services/carrier/carrier.api.service';
import { CarrierSharedService } from '../../../../../shared/services/carrier/carrier.shared.service';
import { SnackbarSharedService } from '../../../../../shared/services/global/snackbar.shared.service';

@Component({
    selector: 'app-del-carrier-dialog-inner',
    templateUrl: './del-carrier-dialog.component.html',
    styleUrls: ['./del-carrier-dialog.component.scss']
  })
  export class DelCarrierDialogComponent implements OnInit {

    // * Internal Service props
    private rowObj;

    constructor(
        public _dialogRef: MatDialogRef <CarrierTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _carrierService: CarrierService,
        private _carrierSharedService: CarrierSharedService,
        private _snackbarSharedService: SnackbarSharedService
    ) {}

    ngOnInit() {
        this._carrierSharedService.currentRowObj.subscribe(receivedRowID => this.rowObj = receivedRowID);
    }

    // ================================================================================
    // * Carrier Del API
    // ================================================================================
    del_carrier(rowId: number) {
        this._carrierService.del_DeleteRow(rowId)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbarSharedService.snackbar_success('Carrier successfully deleted.', 2000);
                    }
                },
                error => {
                    console.log(error);
                        this._snackbarSharedService.snackbar_error('Carrier failed to delete.', 2000);
                }
            );
    }

    // ================================================================================
    // * Dialog
    // ================================================================================
    click_delCarrier() {
        this.del_carrier(this.rowObj[0].id);
        this.closeDialog();
    }

    closeDialog(): void {
        this._dialogRef.close();
    }

}
