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
    private attachCodeFormGroup: FormGroup;
    private attachCountryCodeFormGroup: FormGroup;

    // var
    callPlanObj = [];
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
    ]
    carrierCodesObj = [];
    countryCodeList;
     

    constructor(public dialogRef: MatDialogRef<CallPlanTableComponent>, 
        @Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder, 
        private callPlanService: CallPlanService, private callPlanSharedService: CallPlanSharedService,
        private carrierService: CarrierService,
    ) { }

    ngOnInit() {
        this.addCallPlanFormGroup = this.formBuilder.group({
            callplanCtrl: ['']
        });
        this.attachCodeFormGroup = this.formBuilder.group({
            carrierCtrl: ['', Validators.required],
            plantypeCtrl: ['', Validators.required],
            planpriorityCtrl: ['', Validators.required],
            dayperiodCtrl: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')]],
            plannumberCtrl: ['', Validators.required],
        })
        this.attachCountryCodeFormGroup = this.formBuilder.group({
            codes: this.formBuilder.array([
                this.initCountryCodeFormGroup()
            ])
        })

        this.get_CallPlan();
        this.get_CarrierCodes();

        this.callPlanSharedService.currentCountryCode.subscribe( receivedCountryCodeObj => this.countryCodeList = receivedCountryCodeObj);
    }

    /*
        ~~~~~~~~~~ Call API services ~~~~~~~~~~
    */
        get_CallPlan() {
            this.callPlanService.get_allCallPlan().subscribe(
                data => {
                    console.log(data);
                    this.extractCallPlanNames(data);
                },
                error => { console.log(error); },
            )
        }

        get_CarrierCodes() {
            this.carrierService.get_carriers().subscribe(
                data => {
                    console.log(data);
                    this.extractCarrierCodes(data);
                },
                error => { console.log(error); },
            )
        }

    /*
        ~~~~~~~~~~ Extract Data from JSON into input Format ~~~~~~~~~~
    */
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

        extractCarrierCodes(data) {
            for ( let i = 0 ; i < data.length; i++) {
                this.carrierCodesObj.push( { code: data[i].code, carrier: data[i].name}, );
            }

            console.log(this.carrierCodesObj);
        }

    /*
        ~~~~~~~~~~ Form related UI Methods ~~~~~~~~~~
    */
        initCountryCodeFormGroup() { //Initialize a FormGroup that will be repeated in a nested array
            return this.formBuilder.group({
                originationCtrl: ['', Validators.required],
                destinationCtrl: ['', Validators.required]
            })
        }

        addCodes(): void {
            const control = <FormArray>this.attachCountryCodeFormGroup.controls['codes'];
                control.push(this.initCountryCodeFormGroup());
        }

}
