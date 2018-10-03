import { Component, Inject, OnInit, EventEmitter } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

import { CallPlanTableComponent } from '../../call-plan-table.component'

import { CallPlanSharedService } from '../../../../../shared/common-services/callplan/call-plan.shared.service'
import { CallPlanService } from '../../../../../shared/api-services/callplan/call-plan.api.service'

@Component({
  selector: 'app-del-callplan',
  templateUrl: './del-callplan.component.html',
  styleUrls: ['./del-callplan.component.scss']
})
export class DelCallPlanComponent implements OnInit {

    event_onDel = new EventEmitter;
    private rowIdAll;

    constructor(
        public _dialogRef: MatDialogRef <CallPlanTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _callPlanService: CallPlanService,
        private callPlanSharedServce: CallPlanSharedService 
    ) { }

    ngOnInit() {
        this.callPlanSharedServce.currentRowAll
            .subscribe(receivedRowId => this.rowIdAll = receivedRowId)
    }

    click_delCallPlan() {
        this.del_delCallPlan()
        this.aggrid_delCallPlan()
        this.closeDialog()
    }

    aggrid_delCallPlan() {
        this.event_onDel.emit('del-callplan')
    }

    del_delCallPlan() {
        this._callPlanService.del_callPlan(this.rowIdAll)
            .subscribe(resp => console.log(resp))
    }

    closeDialog(): void {
        this._dialogRef.close()
    }

}
