import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CallPlanTableComponent } from './../../call-plan-table.component';

import { CallPlanService } from './../../../../shared/api-services/callplan/call-plan.api.service';
import { CallPlanSharedService } from '../../../../shared/services/callplan/call-plan.shared.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
  selector: 'app-dettach-ratecards',
  templateUrl: './dettach-ratecards.component.html',
  styleUrls: ['./dettach-ratecards.component.scss']
})
export class DettachRatecardsComponent implements OnInit {

    event_onDettach = new EventEmitter;

    private rowIdAll;
    private rowObjRatecards;

    constructor(
        public dialogRef: MatDialogRef <CallPlanTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private callPlanService: CallPlanService,
        private callPlanSharedServce: CallPlanSharedService,
        private _snackbar: SnackbarSharedService
    ) { }

    ngOnInit() {
        this.callPlanSharedServce.currentRowAll.subscribe(receivedRowId => this.rowIdAll = receivedRowId);
        this.callPlanSharedServce.currentRatecardsObj.subscribe(receivedRowObj => this.rowObjRatecards = receivedRowObj);
    }

    click_dettachRatecards() {
        this.del_detachRatecards();
        this.aggrid_dettachratecards();
        this.closeDialog();
    }

    aggrid_dettachratecards() {
        this.event_onDettach.emit('detach-ratecards');
    }

    del_detachRatecards() {
        let rowRatecardsId: number;
        for (let i = 0; i < this.rowObjRatecards.length; i++) {
            rowRatecardsId = this.rowObjRatecards[i].id;
            this.callPlanService.del_detachRateCard(this.rowIdAll, rowRatecardsId)
                .subscribe(
                    (resp: Response) => {
                        console.log(resp);
                        if ( resp.status === 200 ) {
                            this._snackbar.snackbar_success('Ratecard Delete Successful.', 2000);
                        }
                    },
                    error => {
                        console.log(error);
                        this._snackbar.snackbar_error('Ratecard Delete Failed.', 2000);
                    }
                );
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

}
