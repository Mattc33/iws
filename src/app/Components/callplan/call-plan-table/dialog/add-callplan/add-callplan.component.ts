import { Component, OnInit, Inject, EventEmitter, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { CallPlanTableComponent } from '../../call-plan-table.component';

import { CallPlanService } from '../../../../../shared/api-services/callplan/call-plan.api.service';
import { CallPlanSharedService } from '../../../../../shared/services/callplan/call-plan.shared.service';
import { CarrierService } from '../../../../../shared/api-services/carrier/carrier.api.service';
import { CodesSharedService } from '../../../../../shared/services/global/codes.shared.service';
import { CodesFormSharedService } from '../../../../../shared/services/callplan/attach-callplan-codes.shared.service';

@Component({
  selector: 'app-add-callplan',
  templateUrl: './add-callplan.component.html',
  styleUrls: ['./add-callplan.component.scss']
})
export class AddCallPlanComponent implements OnInit {

    // Events
    event_onAdd = new EventEmitter();

    // Form Group
    addCarrierFormGroup: FormGroup;
    attachCallPlanFormGroup: FormGroup;
    attachCodesFormGroup: FormGroup;
    attachCountryCodesFormGroup: FormGroup;

    // callplan
    carrierObj = [];
    status;
    callplanPlanType;
    activeWhen;
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

    codesPlanType = [
        {code: 0, name: 'Pay as you go'},
        {code: 1, name: 'Unlimited plan'},
        {code: 2, name: 'Minute plan'},
        {code: 3, name: 'Money plan'}
    ];
    planPriorityList = [
        {num: 1}, {num: 2}, {num: 3}, {num: 4}, {num: 5}, {num: 6}, {num: 7}, {num: 8}, {num: 9}
    ];
    finalCallPlanObj;

    // Internal Service
    callplan: string;

    constructor(
        public dialogRef: MatDialogRef<CallPlanTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private formBuilder: FormBuilder,
        private callPlanService: CallPlanService,
        private callPlanSharedService: CallPlanSharedService,
        private carrierService: CarrierService,
        private codesSharedService: CodesSharedService,
        private codesFormSharedService: CodesFormSharedService
    ) { }

    ngOnInit() {
        this.countryCodeList = this.codesSharedService.getCountryCodes();

        this.initFormGroups();
        this.initFormData();

        this.get_CarrierCodes();
        this.attachCallPlanFormGroup.get('validthroughCtrl').disable();
    }

    /*
        ~~~~~~~~~~ Call API Service ~~~~~~~~~~
    */
    get_CarrierCodes() {
        this.carrierService.get_carriers().subscribe(
            data => {this.extractCarrierNames(data);},
            error => { console.log(error); },
        );
    }

    post_callPlan() {
        this.callPlanService.post_newCallPlan(this.finalCallPlanObj)
            .subscribe(resp => console.log(resp));
    }

    // ================================================================================
    // Data Init
    // ================================================================================
    initFormData() {
        this.status = this.codesFormSharedService.provideStatus();
        this.callplanPlanType = this.codesFormSharedService.provideCallplanPlanType();
        this.activeWhen = this.codesFormSharedService.provideActiveWhen();
    }

    initFormGroups() {
        this.addCarrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['', Validators.required]
        });
        this.attachCallPlanFormGroup = this.formBuilder.group(this.initAttachCallplanForms());
        this.attachCodesFormGroup = this.formBuilder.group(this.initAttachCodesForms());
        this.attachCountryCodesFormGroup = this.formBuilder.group({
            codes: this.formBuilder.array([
                this.initCountryCodeFormGroup()
            ])
        });
    }

    initAttachCallplanForms(): Object {
        return {
            titleCtrl: ['', Validators.required],
            subtitleCtrl: [''],
            availableCtrl: ['', Validators.required],
            validthroughCtrl: ['', Validators.required],
            buypriceCtrl: ['', [Validators.required, Validators.pattern(this.currencyPattern)]],
            sellpriceCtrl: ['', [Validators.required, Validators.pattern(this.currencyPattern)]],
            dayperiodCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]],
            rankingCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]],
            plantypeCtrl: ['', Validators.required],
            maxdestinationCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]],
            maxminutesCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]],
            activewhenCtrl: ['', Validators.required],
            promoCtrl: ['', Validators.required],
            descriptionCtrl: ['', Validators.required]
        };
    }

    initAttachCodesForms(): Object {
        return {
            carrierCtrl: ['', Validators.required],
            plantypeCtrl: ['', Validators.required],
            planpriorityCtrl: ['', Validators.required],
            dayperiodCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]],
            plannumberCtrl: ['', [Validators.required, Validators.pattern(this.numPattern)]]
        };
    }


    /*
        ~~~~~~~~~~ Extract Data from JSON into input format ~~~~~~~~~~
    */
    extractCarrierNames(data) {
        for ( let i = 0; i < data.length; i++) {
            this.carrierObj.push( { id: data[i].id, carrier: data[i].name, code: data[i].code}, );
        }
    }

    /*
        ~~~~~~~~~~ Form related UI Methods ~~~~~~~~~~
    */
    onChangePlanType(): boolean { // If user selects plan type UNLIMITED_CALL_PLAN show 2 extra fields
        const planType = this.attachCallPlanFormGroup.get('plantypeCtrl').value;
        if (planType === 'UNLIMITED_CALL_PLAN') {
            return true;
        } else {
            return false;
        }
    }

    initCountryCodeFormGroup() {
        return this.formBuilder.group({
            originationCtrl: ['', Validators.required],
            destinationCtrl: ['', Validators.required]
        });
    }

    addCodes(): void {
        const control = <FormArray>this.attachCountryCodesFormGroup.controls['codes'];
            control.push(this.initCountryCodeFormGroup());
    }

    removeGroup(index: number) {
        const control = <FormArray>this.attachCountryCodesFormGroup.controls['codes'];
        control.removeAt(index);
    }

    /*
        ~~~~~~~~~~ aggrid Event methods ~~~~~~~~~~
    */
    aggrid_addCallPlan(): void {
        this.event_onAdd.emit(this.finalCallPlanObj);
    }

    /*
        ~~~~~~~~~~ Create Final Call Plan Object ~~~~~~~~~~
    */
    pushStaticCallPlanFieldToObj() { // Add Static fields to codes Array
        let maxDestNumber: number; let maxMinutes: number;
        // check if maxdestination/maxminutes fields are skipped then assign them a value of 0 instead of being nulled
            if (this.attachCallPlanFormGroup.get('maxdestinationCtrl').value === '') {
                maxDestNumber = 0;
            } else {
                maxDestNumber = parseInt(this.attachCallPlanFormGroup.get('maxdestinationCtrl').value, 0);
            }
            if (this.attachCallPlanFormGroup.get('maxminutesCtrl').value === '') {
                maxMinutes = 0;
            } else {
                maxMinutes = parseInt(this.attachCallPlanFormGroup.get('maxminutesCtrl').value, 0);
            }
        this.finalCallPlanObj = {
            carrier_id: this.addCarrierFormGroup.get('carrierCtrl').value,
            title: this.attachCallPlanFormGroup.get('titleCtrl').value,
            subtitle: this.attachCallPlanFormGroup.get('subtitleCtrl').value,
            available: this.attachCallPlanFormGroup.get('availableCtrl').value,
            valid_through: Date.parse(this.attachCallPlanFormGroup.get('validthroughCtrl').value).toString,
            buy_price: parseFloat(this.attachCallPlanFormGroup.get('buypriceCtrl').value),
            sell_price: parseFloat(this.attachCallPlanFormGroup.get('sellpriceCtrl').value),
            day_period: parseInt(this.attachCallPlanFormGroup.get('dayperiodCtrl').value, 0),
            ranking: parseInt(this.attachCallPlanFormGroup.get('rankingCtrl').value, 0),
            planTypeName: this.attachCallPlanFormGroup.get('plantypeCtrl').value,
            maxDestNumbers: maxDestNumber,
            maxMinutes: maxMinutes,
            activeWhen: this.attachCallPlanFormGroup.get('activewhenCtrl').value,
            isPurchasable: this.attachCallPlanFormGroup.get('promoCtrl').value,
            description: this.attachCallPlanFormGroup.get('descriptionCtrl').value,
            codes: []
        };
    }

    codesObjBuilder() {
        this.pushStaticCallPlanFieldToObj();
        const countryCodeArr = this.attachCountryCodesFormGroup.get('codes').value;
        for ( let i = 0; i < countryCodeArr.length; i++ ) {
            const ori_cc = countryCodeArr[i].originationCtrl;
            const destinationLen = countryCodeArr[i].destinationCtrl.length;
            for ( let x = 0; x < destinationLen; x++ ) {
                this.finalCallPlanObj.codes.push(
                    {
                        ori_cc: parseInt(ori_cc, 0),
                        dest_cc: parseInt(countryCodeArr[i].destinationCtrl[x], 0),
                        carrier_code: this.attachCodesFormGroup.get('carrierCtrl').value,
                        planType: this.attachCodesFormGroup.get('plantypeCtrl').value,
                        priority: this.attachCodesFormGroup.get('planpriorityCtrl').value,
                        day_period: this.attachCodesFormGroup.get('dayperiodCtrl').value,
                        planNumber: this.attachCodesFormGroup.get('plannumberCtrl').value
                    },
                );
            }
        }
    }

    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~~
    */
    onSelectChangeDest(params) {
        const formArrLen = this.attachCountryCodesFormGroup.get('codes').value.length;
        for ( let i = 0; i < formArrLen; i++) {
            const destinationCtrl = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl').value;
            for (let x = 0; x < destinationCtrl.length; x++) {
                const destinationSetValue = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl');
                if (destinationCtrl[0] === '0') {
                    destinationSetValue.setValue(['0']);
                } else {
                }
            }
        }
    }

    click_addCallPlan() {
        this.post_callPlan();
        this.aggrid_addCallPlan();
        this.closeDialog();
    }

    closeDialog(): void { // close dialog
        this.dialogRef.close();
    }

    /*
        ~~~~~~~~~~ Test Data ~~~~~~~~~~
    */
    insertDummyDataCallPlan() {
        const randomInt = Math.floor(Math.random() * Math.floor(1000));
        this.attachCallPlanFormGroup.get('titleCtrl').setValue(`Random title ${randomInt}`);
        this.attachCallPlanFormGroup.get('subtitleCtrl').setValue(`Random subtitle ${randomInt}`);
        this.attachCallPlanFormGroup.get('availableCtrl').setValue(`available`);
        this.attachCallPlanFormGroup.get('buypriceCtrl').setValue(`1.11`);
        this.attachCallPlanFormGroup.get('sellpriceCtrl').setValue(`2.22`);
        this.attachCallPlanFormGroup.get('dayperiodCtrl').setValue(`27`);
        this.attachCallPlanFormGroup.get('rankingCtrl').setValue(`1`);
        this.attachCallPlanFormGroup.get('plantypeCtrl').setValue(`PAY_AS_YOU_GO_CALL_PLAN`);
        this.attachCallPlanFormGroup.get('maxdestinationCtrl').setValue(`0`);
        this.attachCallPlanFormGroup.get('maxminutesCtrl').setValue(`0`);
        this.attachCallPlanFormGroup.get('activewhenCtrl').setValue(`IMMEDIATELY`);
        this.attachCallPlanFormGroup.get('promoCtrl').setValue(true);
        this.attachCallPlanFormGroup.get('descriptionCtrl').setValue('this is a description');
        console.log(this.attachCallPlanFormGroup.value);
    }

    insertDummyDataCodes() {
        this.attachCodesFormGroup.get('carrierCtrl').setValue(`OBT`);
        this.attachCodesFormGroup.get('plantypeCtrl').setValue(0);
        this.attachCodesFormGroup.get('planpriorityCtrl').setValue(1);
        this.attachCodesFormGroup.get('dayperiodCtrl').setValue(27);
        this.attachCodesFormGroup.get('plannumberCtrl').setValue(1);
        console.log(this.attachCodesFormGroup.value);
    }
}
