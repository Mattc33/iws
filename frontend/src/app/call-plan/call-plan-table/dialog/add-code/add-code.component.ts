import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';

import { CallPlanTableComponent } from './../../../call-plan-table/call-plan-table.component';

import { CallPlanService } from '../../../services/call-plan.api.service';
import { CallPlanSharedService } from './../../../services/call-plan.shared.service';
import { CarrierService } from './../../../../carrier/services/carrier.api.service';
import { CodesSharedService } from './../../../services/codes.shared.service';

@Component({
  selector: 'app-add-code',
  templateUrl: './add-code.component.html',
  styleUrls: ['./add-code.component.scss']
})
export class AddCodeComponent implements OnInit {

    // event_onAdd = new EventEmitter();

    // Form Group
    private addCallPlanFormGroup: FormGroup;
    private attachCodesFormGroup: FormGroup;
    private attachCountryCodesFormGroup: FormGroup;

    // var
    callPlanObj = [];
    planTypes = [
        {code: 0, name: 'Pay as you go'},
        {code: 1, name: 'Unlimited plan'},
        {code: 2, name: 'Minute plan'},
        {code: 3, name: 'Money plan'}
    ];
    planPriorityList = [
        {num: 1}, {num: 2}, {num: 3}, {num: 4}, {num: 5}, {num: 6}, {num: 7}, {num: 8}, {num: 9}
    ];
    carrierCodesObj = [];

    // Service props
    private countryCodeList;
    private finalCodesObj = [];
    private currentRowId: number;

    constructor(
        public dialogRef: MatDialogRef<CallPlanTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private formBuilder: FormBuilder,
        private callPlanService: CallPlanService,
        private callPlanSharedService: CallPlanSharedService,
        private carrierService: CarrierService,
        private codesSharedService: CodesSharedService
    ) { }

    ngOnInit() {
        this.countryCodeList = this.codesSharedService.getCountryCodes();

        this.attachCodesFormGroup = this.formBuilder.group({
            carrierCtrl: ['', Validators.required],
            plantypeCtrl: ['', Validators.required],
            planpriorityCtrl: ['', Validators.required],
            dayperiodCtrl: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            plannumberCtrl: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        });
        this.attachCountryCodesFormGroup = this.formBuilder.group({
            codes: this.formBuilder.array([
                this.initCountryCodeFormGroup()
            ])
        });

        this.get_CarrierCodes();

        this.callPlanSharedService.currentRowAll.subscribe( data => this.currentRowId = data  );
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
            );
        }

        post_attachCallPlanCodes(callplanId: number, body: object) {
            this.callPlanService.post_newPlanCode(callplanId, body).subscribe(
                resp => { console.log(resp); }
            );
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
        ~~~~~~~~~~ Form related UI ~~~~~~~~~~
    */
        initCountryCodeFormGroup() {
            return this.formBuilder.group({
                originationCtrl: ['', Validators.required],
                destinationCtrl: ['', Validators.required]
            });
        }

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

        addCodes(): void {
            const control = <FormArray>this.attachCountryCodesFormGroup.controls['codes'];
                control.push(this.initCountryCodeFormGroup());
        }

        removeAddress(index: number) {
            const control = <FormArray>this.attachCountryCodesFormGroup.controls['codes'];
                control.removeAt(index);
        }

        codesObjBuilder() {
            console.log(this.attachCountryCodesFormGroup.get('codes').value);
            const countryCodeArr = this.attachCountryCodesFormGroup.get('codes').value;

            for ( let i = 0; i < countryCodeArr.length; i++ ) {
                const ori_cc = countryCodeArr[i].originationCtrl;
                const destinationLen = countryCodeArr[i].destinationCtrl.length;
                for ( let x = 0; x < destinationLen; x++ ) {
                    this.finalCodesObj.push(
                        {
                            ori_cc: parseInt(ori_cc),
                            des_cc: parseInt(countryCodeArr[i].destinationCtrl[x]),
                            carrier_code: this.attachCodesFormGroup.get('carrierCtrl').value,
                            planType: this.attachCodesFormGroup.get('plantypeCtrl').value,
                            priority: this.attachCodesFormGroup.get('planpriorityCtrl').value,
                            day_period: parseInt(this.attachCodesFormGroup.get('dayperiodCtrl').value),
                            planNumber: parseInt(this.attachCodesFormGroup.get('plannumberCtrl').value)
                        },
                    );
                }
            }
        }

    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
        click_attachCodes(): void {
            this.post_attachCodes();
            // this.aggrid_attachCodes();
            this.closeDialog();
        }

        // aggrid_attachCodes(): void {
        //     this.event_onAdd.emit(this.finalCodesObj);
        // }

        post_attachCodes() {
            for ( let i = 0; i < this.finalCodesObj.length; i++) {
                this.post_attachCallPlanCodes(this.currentRowId, this.finalCodesObj[i]);
            }
        }

        closeDialog(): void { // close dialog
            this.dialogRef.close();
        }

}
