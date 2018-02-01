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

    // Events
    event_onAdd = new EventEmitter();

    // Form Group var
    addCallPlanFormGroup: FormGroup;
    attachRateCardFormGroup: FormGroup;
    choosePriorityFormGroup: FormGroup;

    // Internal Service Props
    rateCardObj = [];
    callPlanObj = [];

    // Dropdown Props
    planPriorityList = [
        {num: 9}, {num: 8}, {num: 7}, {num: 6}, {num: 5}, {num: 4}, {num: 3}, {num: 2}, {num: 1}
    ];

    constructor(
        public dialogRef: MatDialogRef<CallPlanTableComponent>, 
        @Inject(MAT_DIALOG_DATA) public data, 
        private formBuilder: FormBuilder, 
        private callPlanService: CallPlanService, 
        private callPlanSharedService: CallPlanSharedService,
        private rateCardsService: RateCardsService
    ) { }

    ngOnInit() {
        this.addCallPlanFormGroup = this.formBuilder.group({
            callplanCtrl: ['', Validators.required]
        });
        this.attachRateCardFormGroup = this.formBuilder.group({
            ratecardCtrl: ['', Validators.required]
        });
        this.choosePriorityFormGroup = this.formBuilder.group({
            priorityCtrl: ['', Validators.required]
        })

        this.get_CallPlan();
        this.get_RateCards();
    }

    /*
        ~~~~~~~~~~ Call API services ~~~~~~~~~~
    */
        get_CallPlan(): void {
            this.callPlanService.get_allCallPlan().subscribe(
                data => {
                    console.log(data);
                    this.extractCallPlanNames(data);
                },
                error => { console.log(error); },
            )
        }

        get_RateCards(): void {
            this.rateCardsService.get_RateCard().subscribe(
                data => {
                    console.log(data);
                    this.extractRateCardNames(data);
                },
                error => { console.log(error); },
            );
        }

        post_attachRateCard(): void {
            const ratecardId = this.getSelectedRateCardId();
            const callplanId = this.getSelectedCallPlanId();
            const body = {
                priority: this.choosePriorityFormGroup.get('priorityCtrl').value
            };
    
            this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
                 .subscribe(resp => console.log(resp));
        }

    /*
        ~~~~~~~~~~ Extract JSON objects and format them into input ~~~~~~~~~~
    */
        extractRateCardNames(data): void {
            for ( let i = 0 ; i < data.length; i++) {
                this.rateCardObj.push( { value: data[i].name, id: data[i].id }, );
            }
        }

        extractCallPlanNames(data): void {
            for ( let i = 0 ; i < data.length; i++) {
                this.callPlanObj.push( { title: data[i].title, id: data[i].id }, );
            }
        }
    /*
        ~~~~~~~~~~ Get selected values from input, i.e. names, Id's, ect ~~~~~~~~~~
    */
        getSelectedCallPlanId(): number {
            const callplanId = this.addCallPlanFormGroup.get('callplanCtrl').value;
                return callplanId;
        }

        getSelectedCallPlanName(): string {
            const callplanIdFromInput = this.getSelectedCallPlanId();
            const callplanArr = this.callPlanObj;
            let callplanName: string;

            for (let i = 0; i < callplanArr.length; i++) {
                if ( callplanIdFromInput === callplanArr[i].id ) {
                    callplanName = callplanArr[i].title;
                } else {
                }
            }
                return callplanName;
        }

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

        getSelectedPriority(): number {
            const priority = this.choosePriorityFormGroup.get('priorityCtrl').value;
                return priority;
        }

    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
        click_attachRatecard(): void { // trigger on submit click
            this.post_attachRateCard();
            this.closeDialog();
        }

        closeDialog(): void { // close dialog
            this.dialogRef.close();
        }
}
