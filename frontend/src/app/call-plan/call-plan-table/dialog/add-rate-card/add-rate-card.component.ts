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
    private addCallPlanFormGroup: FormGroup;
    private attachRateCardFormGroup: FormGroup;
    private choosePriorityFormGroup: FormGroup;

    // Internal Service Props
    private rateCardsFromService;
    private finalRateCardObj = [];
    private callPlanObj = [];
    private currentRowId;

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
        this.attachRateCardFormGroup = this.formBuilder.group({
            ratecardCtrl: ['', Validators.required]
        });
        this.choosePriorityFormGroup = this.formBuilder.group({
            priorityCtrl: ['', Validators.required]
        })

        this.callPlanSharedService.currentRowAll.subscribe(data => this.currentRowId = data);

        this.get_RateCards();
    }

    /*
        ~~~~~~~~~~ Call API services ~~~~~~~~~~
    */
        get_RateCards(): void {
            this.rateCardsService.get_RateCard().subscribe(
                data => {
                    console.log(data);
                    this.rateCardsFromService = data;
                    this.extractRateCardNames(data);
                },
                error => { console.log(error); },
            );
        }

        post_attachRateCard(): void {
            const ratecardId = this.getSelectedRateCardId();
            const callplanId = this.currentRowId;
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
                if(this.rateCardsFromService[i].active === 1) { // If ratecard is activated add to displayed ratecards arr
                    this.finalRateCardObj.push( { value: data[i].name, id: data[i].id }, );
                }
            }
        }
    /*
        ~~~~~~~~~~ Get selected values from input, i.e. names, Id's, ect ~~~~~~~~~~
    */
        getSelectedRateCardId(): number {
            const rateCardId = this.attachRateCardFormGroup.get('ratecardCtrl').value;
                return rateCardId;
        }

        getSelectedRateCardName(): string {
            const ratecardIdFromInput = this.getSelectedRateCardId();
            const ratecardArr = this.finalRateCardObj;
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
            this.aggrid_attachRatecards();
            this.closeDialog();
        }

        aggrid_attachRatecards(): void {
            const body = {
                name: this.getSelectedRateCardName(),
            }

            this.event_onAdd.emit(body);
        }

        closeDialog(): void { // close dialog
            this.dialogRef.close();
        }
}
