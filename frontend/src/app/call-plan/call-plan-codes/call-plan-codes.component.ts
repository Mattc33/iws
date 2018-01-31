import { Component, OnInit } from '@angular/core';

import { CallPlanSharedService } from './../services/call-plan.shared.service';

@Component({
  selector: 'app-call-plan-codes',
  templateUrl: './call-plan-codes.component.html',
  styleUrls: ['./call-plan-codes.component.scss']
})
export class CallPlanCodesComponent implements OnInit {

    callPlanObj;

    constructor(private callPlanSharedService: CallPlanSharedService) { }

    ngOnInit() {
        this.callPlanSharedService.currentCallPlanObj
        .subscribe(receiveCallPlanObj => this.callPlanObj = receiveCallPlanObj);
    }

}
