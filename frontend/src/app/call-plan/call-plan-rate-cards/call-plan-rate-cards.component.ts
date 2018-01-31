import { Component, OnInit } from '@angular/core';

import { CallPlanSharedService } from './../services/call-plan.shared.service';

@Component({
  selector: 'app-call-plan-rate-cards',
  templateUrl: './call-plan-rate-cards.component.html',
  styleUrls: ['./call-plan-rate-cards.component.scss']
})
export class CallPlanRateCardsComponent implements OnInit {

    callPlanObj;

    constructor(private callPlanSharedService: CallPlanSharedService) { }

    ngOnInit() {
        this.callPlanSharedService.currentCallPlanObj
            .subscribe(receiveCallPlanObj => this.callPlanObj = receiveCallPlanObj);
    }

}
