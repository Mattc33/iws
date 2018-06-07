import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CarrierProfileComponent } from './../../carrier-profile.component';
import { CarrierSharedService } from './../../../../shared/services/carrier/carrier.shared.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
  selector: 'app-del-carrier-profile-dialog',
  templateUrl: './del-carrier-profile-dialog.component.html',
  styleUrls: ['./del-carrier-profile-dialog.component.scss']
})
export class DelCarrierProfileDialogComponent implements OnInit {

    // * Internal Service props
    private rowObj;

    constructor(
        public _dialogRef: MatDialogRef <CarrierProfileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _carrierSharedService: CarrierSharedService,
        private _snackbarSharedService: SnackbarSharedService
    ) { }

    ngOnInit() {

    }

    // ================================================================================
    // * Carrier Profile Del API
    // ================================================================================
    del_carrierProfile(rowId: number) {
        // this._carrierProfileService.del_carrierProfile(rowId)
        //     .subscribe(
        //         (resp: Response) => {
        //             console.log(resp);
        //             if ( resp.status === 200 ) {
        //                 this._snackbarSharedService.snackbar_success('Carrier Profile successfully deleted.', 2000);
        //             }
        //         },
        //         error => {
        //             console.log(error);
        //                 this._snackbarSharedService.snackbar_error('Carrier failed to delete.', 2000);
        //         }
        //     );
    }

    // ================================================================================
    // * Dialog
    // ================================================================================
    click_delCarrier() {
        // this.del_carrier(this.rowObj[0].id);
        this.closeDialog();
    }

    closeDialog(): void {
        this._dialogRef.close();
    }


}
