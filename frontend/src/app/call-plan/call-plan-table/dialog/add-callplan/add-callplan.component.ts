import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CallPlanTableComponent } from './../../../call-plan-table/call-plan-table.component';

import { CallPlanService } from '../../../services/call-plan.api.service';
import { CallPlanSharedService } from './../../../services/call-plan.shared.service';
import { CarrierService } from './../../../../carrier/services/carrier.api.service';

@Component({
  selector: 'app-add-callplan',
  templateUrl: './add-callplan.component.html',
  styleUrls: ['./add-callplan.component.scss']
})
export class AddCallPlanComponent implements OnInit {

    event_onAdd = new EventEmitter();

    // Form Group
    private addCarrierFormGroup: FormGroup;
    private attachCallPlanFormGroup: FormGroup;
    private attachCodeFormGroup: FormGroup;

    // callplan
    carrierObj = [];
    status = [
        {value: 'available'},
        {value: 'unavailable'},
        {value: 'deleted'},
        {value: 'staged'},
        {value: 'pending'},
    ];
    planType = [
        {name: 'Unlimited', value: 'UNLIMITED_CALL_PLAN'},
        {name: 'Pay As You Go', value: 'PAY_AS_YOU_GO_CALL_PLAN'},
        {name: 'Minutes', value: 'MINUTES_CALL_PLAN'},
    ];
    activeWhen = [
        {name: 'Activated Immediately', value: 'IMMEDIATELY'},
        {name: 'Activated on a successful call', value: 'SUCCESS_CALL'}
    ];
    promotion = [
        {name: 'Yes', value: true},
        {name: 'No', value: false},
    ];
    unlimitedPlanToggle = false;
    callPlanObj = [];
    
    // Patterns
    currencyPattern = /^\d+\.\d{2}$/;
    numPattern = '^[0-9]+$';

    // codes
    countryCodeList;
    planNumber = [
        {num: 0}, {num: 1}, {num: 2}, {num: 3}, {num: 4}, {num: 5}, {num: 6}, {num: 7}, {num: 8}, {num: 9}, {num: 10}, 
        {num: 11}, {num: 12}, {num: 13}, {num: 14}, {num: 15}, {num: 16}, {num: 17}, {num: 18}, {num: 19}, {num: 20}
    ];
    planTypes = [
        {code: 0, name: 'Pay as you go'},
        {code: 1, name: 'Unlimited plan'},
        {code: 2, name: 'Minute plan'},
        {code: 3, name: 'Money plan'}
    ];
    planPriorityList = [
        {num: 1}, {num: 2}, {num: 3}, {num: 4}, {num: 5}, {num: 6}, {num: 7}, {num: 8}, {num: 9}
    ];

    constructor(public dialogRef: MatDialogRef<CallPlanTableComponent>, 
        @Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder, 
        private callPlanService: CallPlanService, private callPlanSharedService: CallPlanSharedService,
        private carrierService: CarrierService,
    ) { }

    ngOnInit() {
        this.addCarrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['']
        });
        this.attachCallPlanFormGroup = this.formBuilder.group({
            titleCtrl: ['', Validators.required],
            subtitleCtrl: [''],
            descriptionCtrl: ['', Validators.required],
            availableCtrl: ['', Validators.required],
            validthroughCtrl: ['', [Validators.required]],
            buypriceCtrl: ['', [Validators.required, Validators.pattern(this.currencyPattern)]],
            sellpriceCtrl: ['', [Validators.required, Validators.pattern(this.currencyPattern)]],
            dayperiodCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]],
            rankingCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]],
            plantypeCtrl: ['', Validators.required],
            maxdestinationCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]],
            maxminutesCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]],
            activewhenCtrl: ['', Validators.required],
            promoCtrl: ['', Validators.required],
        })
        this.attachCodeFormGroup = this.formBuilder.group({
            originationCtrl: ['', Validators.required],
            destinationCtrl: ['', Validators.required],
            carrierCtrl: ['', Validators.required],
            plantypeCtrl: ['', Validators.required],
            planpriorityCtrl: ['', Validators.required],
            dayperiodCtrl: ['', Validators.required],
            plannumberCtrl: ['', Validators.required],
        });

        // Call internal service and grab country codes json obj
        this.callPlanSharedService.currentCountryCode.subscribe( receivedCountryCodeObj => this.countryCodeList = receivedCountryCodeObj);

        this.get_CarrierCodes();
    }

    get_CarrierCodes() {
        this.carrierService.get_carriers().subscribe(
            data => {
                console.log(data);
                this.extractCarrierNames(data);
            },
            error => { console.log(error); },
        )
    }

    extractCarrierNames(data) {
        for ( let i = 0; i < data.length; i++) {
            this.carrierObj.push( { id: data[i].id, carrier: data[i].name, code: data[i].code}, );
        }
        // console.log(this.carrierObj);
    }

    onChangePlanType(): boolean {
        const planType = this.attachCallPlanFormGroup.get('plantypeCtrl').value;
        if (planType === 'UNLIMITED_CALL_PLAN') {
            return true;
        } else {
            return false;
        }
    }

    post_callPlan() {
        let maxDestNumber: number;
        let maxMinutes: number;
            if(this.attachCallPlanFormGroup.get('maxdestinationCtrl').value === ''){
                maxDestNumber = 0;
            } else {
                maxDestNumber = parseInt(this.attachCallPlanFormGroup.get('maxdestinationCtrl').value);
            }
            if(this.attachCallPlanFormGroup.get('maxminutesCtrl').value === ''){
                maxMinutes = 0;
            } else {
                maxMinutes = parseInt(this.attachCallPlanFormGroup.get('maxminutesCtrl').value);
            }
        const body = {
            carrier_id: this.addCarrierFormGroup.get('carrierCtrl').value,
            title: this.attachCallPlanFormGroup.get('titleCtrl').value,
            subtitle: this.attachCallPlanFormGroup.get('subtitleCtrl').value,
            available: this.attachCallPlanFormGroup.get('availableCtrl').value,
            valid_through: Date.parse(this.attachCallPlanFormGroup.get('validthroughCtrl').value).toString(),
            buy_price: parseFloat(this.attachCallPlanFormGroup.get('buypriceCtrl').value),
            sell_price: parseFloat(this.attachCallPlanFormGroup.get('sellpriceCtrl').value),
            day_period: parseInt(this.attachCallPlanFormGroup.get('dayperiodCtrl').value),
            ranking: parseInt(this.attachCallPlanFormGroup.get('rankingCtrl').value),
            planTypeName: this.attachCallPlanFormGroup.get('plantypeCtrl').value,
            maxDestNumbers: maxDestNumber,
            maxMinutes: maxMinutes,
            activeWhen: this.attachCallPlanFormGroup.get('activewhenCtrl').value,
            isForPromotion: this.attachCallPlanFormGroup.get('promoCtrl').value,
            code: [{
                ori_cc: parseInt(this.attachCodeFormGroup.get('originationCtrl').value),
                des_cc: parseInt(this.attachCodeFormGroup.get('destinationCtrl').value),
                carrier_code: this.attachCodeFormGroup.get('carrierCtrl').value,
                planType: parseInt(this.attachCodeFormGroup.get('destinationCtrl').value),
                priority: parseInt(this.attachCodeFormGroup.get('planpriorityCtrl').value),
                dayPeriod: parseInt(this.attachCodeFormGroup.get('dayperiodCtrl').value),
                planNumber: parseInt(this.attachCodeFormGroup.get('plannumberCtrl').value),
            }]
        };

        console.log(body);
        this.callPlanService.post_newCallPlan(body)
            .subscribe(resp => console.log(resp));

    }

    aggrid_addCallPlan(body) {
        this.event_onAdd.emit(body);
    }

    click_addCallPlan() {
        
    }

    // pass dialog event 

    // Validation
    priceErr(): string {
        if(this.attachCallPlanFormGroup.get('buypriceCtrl').hasError('required') || this.attachCallPlanFormGroup.get('sellpriceCtrl').hasError('required')){
          return 'You must enter a dollar amount';
        } 
        if(this.attachCallPlanFormGroup.get('buypriceCtrl').hasError('pattern') || this.attachCallPlanFormGroup.get('sellpriceCtrl').hasError('pattern')) {
          return 'You must enter a valid currency format xx.xx';
        }
    }

    isNaNErr(): string {
        if (this.attachCallPlanFormGroup.get('dayperiodCtrl').hasError('required') ||
        this.attachCallPlanFormGroup.get('rankingCtrl').hasError('required')
            ) {
            return 'You must enter the number of days';
        }
        if (this.attachCallPlanFormGroup.get('dayperiodCtrl').hasError('pattern')) {
            return 'You must enter a whole number';
        }
    }


}
