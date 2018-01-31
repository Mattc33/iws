import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CallPlanTableComponent } from './../../../call-plan-table/call-plan-table.component';

import { CallPlanService } from '../../../services/call-plan.api.service';
import { CallPlanSharedService } from './../../../services/call-plan.shared.service';
import { RateCardsService } from './../../../../rate-cards/services/rate-cards.api.service';


@Component({
  selector: 'app-add-rate-card',
  templateUrl: './add-rate-card.component.html',
  styleUrls: ['./add-rate-card.component.scss']
})
export class AddRateCardComponent implements OnInit {

    event_onAdd = new EventEmitter();

    // Form Group var
    addCallPlanFormGroup: FormGroup;
    attachRateCardFormGroup: FormGroup;

    // var
    rateCardObj = [];
    callPlanObj = [];

    constructor(public dialogRef: MatDialogRef<CallPlanTableComponent>, 
        @Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder, 
        private callPlanService: CallPlanService, private callPlanSharedService: CallPlanSharedService,
        private rateCardsService: RateCardsService
    ) { }

    ngOnInit() {
        this.addCallPlanFormGroup = this.formBuilder.group({
            callplanCtrl: ['', Validators.required]
        });
        this.attachRateCardFormGroup = this.formBuilder.group({
            ratecardCtrl: ['', Validators.required]
        })
        this.get_CallPlan();
        this.get_RateCards();
    
    }

    // subscribe to serice and get call plans
    get_CallPlan() {
        this.callPlanService.get_allCallPlan().subscribe(
            data => {
                console.log(data);
                this.extractCallPlanNames(data);
            },
            error => { console.log(error); },
        )
    }

    extractCallPlanNames(data): void {
        for ( let i = 0 ; i < data.length; i++) {
            this.callPlanObj.push( { title: data[i].title, id: data[i].id }, );
        }

        console.log(this.callPlanObj);
    }

    getSelectedCallPlanId(): number {
        const callplanId = this.addCallPlanFormGroup.get('callplanCtrl').value;
        return callplanId;
    }

    get_RateCards() {
        this.rateCardsService.get_RateCard().subscribe(
            data => {
                console.log(data);
                this.extractRateCardNames(data);
            },
            error => { console.log(error); },
        );
    }

    extractRateCardNames(data): void {
        for ( let i = 0 ; i < data.length; i++) {
            this.rateCardObj.push( { value: data[i].name, id: data[i].id }, );
        }

        console.log(this.rateCardObj);
    }

    // Get ratecard ID from input
    getSelectedRateCardId(): number {
        const rateCardId = this.attachRateCardFormGroup.get('ratecardCtrl').value;
        return rateCardId;
    }

    getSelectedRateCardName(): string {
        const ratecardIdFromInput = this.getSelectedRateCardId();
        const ratecardArr = this.rateCardObj;
        let ratecardName: string;

        for (let i = 0; i < ratecardArr.length; i++) {
            if ( ratecardIdFromInput === ratecardArr[i].id ) {
                ratecardName = ratecardArr[i].value;
            } else {
            }
        }

        return ratecardName;
    }

    click_attachRatecard(){
        this.post_attachRateCard();
        this.closeDialog();
    }

    post_attachRateCard() {
        const ratecardId = this.getSelectedRateCardId();
        const callplanId = this.getSelectedCallPlanId();
        const body = [{}]

        this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
            .subscribe(res => console.log(res));
    }

    // close dialog
    closeDialog(): void {
        this.dialogRef.close();
    }
}
