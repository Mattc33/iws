import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';

import { CallPlanTableComponent } from './../../../call-plan-table/call-plan-table.component';

import { CallPlanService } from '../../../services/call-plan.api.service';
import { CallPlanSharedService } from './../../../services/call-plan.shared.service';
import { CarrierService } from './../../../../carrier/services/carrier.api.service';

@Component({
  selector: 'app-add-code',
  templateUrl: './add-code.component.html',
  styleUrls: ['./add-code.component.scss']
})
export class AddCodeComponent implements OnInit {

    event_onAdd = new EventEmitter();

    // Form Group 
    private addCallPlanFormGroup: FormGroup;
    private attachCodesFormGroup: FormGroup;
    private attachCountryCodesFormGroup: FormGroup;

    // var
    callPlanObj = [];
    planNumber = [
        {num: 1}, {num: 2}, {num: 3}, {num: 4}, {num: 5}, {num: 6}, {num: 7}, {num: 8}, {num: 9}, {num: 10}, 
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
    ]
    carrierCodesObj = [];

    // Service props
    countryCodeList;
    finalCodesObj;
    currentRowId: number;
     
    constructor(
        public dialogRef: MatDialogRef<CallPlanTableComponent>, 
        @Inject(MAT_DIALOG_DATA) public data, 
        private formBuilder: FormBuilder, 
        private callPlanService: CallPlanService, 
        private callPlanSharedService: CallPlanSharedService,
        private carrierService: CarrierService,
    ) { }

    ngOnInit() {
        this.attachCodesFormGroup = this.formBuilder.group({
            carrierCtrl: ['', Validators.required],
            plantypeCtrl: ['', Validators.required],
            planpriorityCtrl: ['', Validators.required],
            dayperiodCtrl: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')]],
            plannumberCtrl: ['', Validators.required]
        })
        this.attachCountryCodesFormGroup = this.formBuilder.group({
            originationCtrl: ['', Validators.required],
            destinationCtrl: ['', Validators.required]
        })

        this.get_CarrierCodes();

        this.callPlanSharedService.currentRowAll.subscribe( data => this.currentRowId = data  );
        this.callPlanSharedService.currentCountryCode
            .subscribe( data => this.countryCodeList = data);
    }

    /*
        ~~~~~~~~~~ Call API services ~~~~~~~~~~
    */
        get_CarrierCodes() {
            this.carrierService.get_carriers().subscribe(
                data => {
                    console.log(data);
                    this.extractCarrierCodes(data);
                },
                error => { console.log(error); },
            )
        }

        post_attachCallPlanCodes() {
            const obj = this.finalCodesObj;
            const callplanId = this.currentRowId;    
            this.callPlanService.post_newPlanCode(callplanId, obj).subscribe(
                resp => {console.log(resp);}
            )
        }

    /*
        ~~~~~~~~~~ Extract Data from JSON into input Format ~~~~~~~~~~
    */
        extractCarrierCodes(data) {
            for ( let i = 0 ; i < data.length; i++) {
                this.carrierCodesObj.push( { code: data[i].code, carrier: data[i].name}, );
            }
        }

        insertDummyDataCodes() {
            this.attachCodesFormGroup.get('carrierCtrl').setValue(`OBT`);
            this.attachCodesFormGroup.get('plantypeCtrl').setValue(0);
            this.attachCodesFormGroup.get('planpriorityCtrl').setValue(1);
            this.attachCodesFormGroup.get('dayperiodCtrl').setValue(27);
            this.attachCodesFormGroup.get('plannumberCtrl').setValue(1);
        }

    /*
        ~~~~~~~~~~ Create final Codes Object (finalCodesObj) ~~~~~~~~~~
    */    
        codesObjBuilder() {
            const countryCodeArr = this.attachCountryCodesFormGroup.value.codes;
                this.finalCodesObj =
                    {
                        ori_cc: parseInt(this.attachCountryCodesFormGroup.get('originationCtrl').value),
                        des_cc: parseInt(this.attachCountryCodesFormGroup.get('destinationCtrl').value),
                        carrier_code: this.attachCodesFormGroup.get('carrierCtrl').value,
                        planType: parseInt(this.attachCodesFormGroup.get('plantypeCtrl').value),
                        priority: parseInt(this.attachCodesFormGroup.get('planpriorityCtrl').value),
                        day_period: parseInt(this.attachCodesFormGroup.get('dayperiodCtrl').value),
                        planNumber: this.attachCodesFormGroup.get('plannumberCtrl').value
                    },

            console.log(this.finalCodesObj);
        }

    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
        click_attachCodes(): void {
            this.post_attachCallPlanCodes();
            this.aggrid_attachCodes();
            this.closeDialog();
        }

        aggrid_attachCodes(): void {
            const body = {
                ori_cc: parseInt(this.attachCountryCodesFormGroup.get('originationCtrl').value),
                des_cc: parseInt(this.attachCountryCodesFormGroup.get('destinationCtrl').value),
                carrier_code: this.attachCodesFormGroup.get('carrierCtrl').value,
                planType: parseInt(this.attachCodesFormGroup.get('plantypeCtrl').value),
                priority: parseInt(this.attachCodesFormGroup.get('planpriorityCtrl').value),
                day_period: parseInt(this.attachCodesFormGroup.get('dayperiodCtrl').value),
                planNumber: this.attachCodesFormGroup.get('plannumberCtrl').value
            };

            this.event_onAdd.emit(body);
        }

        closeDialog(): void { // close dialog
            this.dialogRef.close();
        }

}
