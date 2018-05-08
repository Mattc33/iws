import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CallPlanTableComponent } from './../../call-plan-table.component';

import { CallPlanService } from '../../../services/call-plan.api.service';
import { CallPlanSharedService } from '../../../services/call-plan.shared.service';

@Component({
  selector: 'app-del-callplan',
  templateUrl: './del-callplan.component.html',
  styleUrls: ['./del-callplan.component.scss']
})
export class DelCallPlanComponent implements OnInit {

    event_onDel = new EventEmitter;
    private rowIdAll;

    constructor(
        public dialogRef: MatDialogRef <CallPlanTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private callPlanService: CallPlanService,
        private callPlanSharedServce: CallPlanSharedService 
    ) { }

    ngOnInit() {
        this.callPlanSharedServce.currentRowAll
            .subscribe(receivedRowId => this.rowIdAll = receivedRowId);
    }

    click_delCallPlan() {
        this.del_delCallPlan();
        this.aggrid_delCallPlan();

        this.closeDialog();
    }

    aggrid_delCallPlan() {
        this.event_onDel.emit('del-callplan');
    }

    del_delCallPlan() {
        this.callPlanService.del_callPlan(this.rowIdAll)
            .subscribe(resp => console.log(resp));
    }

    // On method call close dialog
    closeDialog(): void {
        this.dialogRef.close();
    }

}
