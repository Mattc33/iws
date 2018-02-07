import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CallPlanTableComponent } from './../../call-plan-table.component';

import { CallPlanService } from '../../../services/call-plan.api.service';
import { CallPlanSharedService } from '../../../services/call-plan.shared.service';

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
        private callPlanSharedServce: CallPlanSharedService 
    ) { }

    ngOnInit() {
        this.callPlanSharedServce.currentRowAll
            .subscribe(receivedRowId => this.rowIdAll = receivedRowId);
        this.callPlanSharedServce.currentRatecardsObj
            .subscribe(receivedRowObj => this.rowObjRatecards = receivedRowObj);
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
        for (let i = 0; i<this.rowObjRatecards.length; i++) {
            rowRatecardsId = this.rowObjRatecards[i].id;
            this.callPlanService.del_detachRateCard(this.rowIdAll, rowRatecardsId)
                .subscribe(resp => console.log(resp));
        }
    }

    // On method call close dialog
    closeDialog(): void {
        this.dialogRef.close();
    }

}
