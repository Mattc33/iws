import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CallPlanTableComponent } from './../../call-plan-table.component';

import { CallPlanService } from '../../../services/call-plan.api.service';
import { CallPlanSharedService } from '../../../services/call-plan.shared.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
  selector: 'app-dettach-codes',
  templateUrl: './dettach-codes.component.html',
  styleUrls: ['./dettach-codes.component.scss']
})
export class DettachCodesComponent implements OnInit {

    event_onDettach = new EventEmitter;
    private rowIdAll;
    private rowObjCodes;

    constructor(
        public dialogRef: MatDialogRef <CallPlanTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private callPlanService: CallPlanService,
        private callPlanSharedServce: CallPlanSharedService,
        private _snackbar: SnackbarSharedService
    ) { }

    ngOnInit() {
        this.callPlanSharedServce.currentRowAll
            .subscribe(receivedRowId => this.rowIdAll = receivedRowId);
        this.callPlanSharedServce.currentCodesObj
            .subscribe(receivedRowObj => this.rowObjCodes = receivedRowObj);
    }

    click_dettachRatecards() {
        this.del_detachCodes();
        this.aggrid_dettachCodes();
        this.closeDialog();
    }

    aggrid_dettachCodes() {
        this.event_onDettach.emit('detach-codes');
    }

    del_detachCodes() {
        let rowCodesId: number;
        for (let i = 0; i < this.rowObjCodes.length; i++) {
            rowCodesId = this.rowObjCodes[i].id;
            this.callPlanService.del_planCode(this.rowIdAll, rowCodesId)
                .subscribe(
                    (resp: Response) => {
                        console.log(resp);
                        if ( resp.status === 200 ) {
                            this._snackbar.snackbar_success('Codes Delete Successful.', 2000);
                        }
                    },
                    error => {
                        console.log(error);
                        this._snackbar.snackbar_error('Codes Delete failed.', 2000);
                    }
                );
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

}
