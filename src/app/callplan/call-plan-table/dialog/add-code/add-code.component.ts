import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';

import { CallPlanTableComponent } from './../../../call-plan-table/call-plan-table.component';

import { CallPlanService } from './../../../../shared/api-services/callplan/call-plan.api.service';
import { CallPlanSharedService } from '../../../../shared/services/callplan/call-plan.shared.service';
import { CarrierService } from './../../../../shared/api-services/carrier/carrier.api.service';
import { CodesSharedService } from './../../../../shared/services/global/codes.shared.service';
import { CodesFormSharedService } from './../../../../shared/services/callplan/attach-callplan-codes.shared.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
  selector: 'app-add-code',
  templateUrl: './add-code.component.html',
  styleUrls: ['./add-code.component.scss']
})
export class AddCodeComponent implements OnInit {

    // Form Group
    private addCallPlanFormGroup: FormGroup;
    private attachCodesFormGroup: FormGroup;
    private attachCountryCodesFormGroup: FormGroup;

    // Form Data
    callPlanObj = [];
    codePlanTypes;
    planPriorityList;
    carrierCodesObj = [];
    countryCodeList;

    // Service props
    private finalCodesObj = [];
    private currentRowId: number;

    constructor(
        public dialogRef: MatDialogRef<CallPlanTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private formBuilder: FormBuilder,
        private callPlanService: CallPlanService,
        private callPlanSharedService: CallPlanSharedService,
        private carrierService: CarrierService,
        private codesSharedService: CodesSharedService,
        private codesFormSharedService: CodesFormSharedService,
        private _snackbar: SnackbarSharedService
    ) { }

    ngOnInit() {
        this.get_CarrierCodes();
        this.initCodesFormData();
        this.initCodesFormGroup();

        this.callPlanSharedService.currentRowAll.subscribe( data => this.currentRowId = data );
    }

    // ================================================================================
    // API services
    // ================================================================================
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
            (resp: Response) => {
                console.log(resp);
                if ( resp.status === 200 ) {
                    this._snackbar.snackbar_success('Codes Attached Successful.', 2000);
                }
            },
            error => {
                console.log(error);
                this._snackbar.snackbar_error('Codes Attached failed.', 2000);
            }
        );
    }

    // ================================================================================
    // Init Forms & Form Data
    // ================================================================================
    initCodesFormData() {
        this.countryCodeList = this.codesSharedService.getCountryCodes();
        this.codePlanTypes = this.codesFormSharedService.provideCodePlanTypes();
        this.planPriorityList = this.codesFormSharedService.providePriorityList();
    }

    initCodesFormGroup() {
        this.attachCodesFormGroup = this.formBuilder.group(this.buildAttachCodesFormGroup());
        this.attachCountryCodesFormGroup = this.formBuilder.group({
            codes: this.formBuilder.array([
                this.initCountryCodeFormGroup()
            ])
        });
    }

    buildAttachCodesFormGroup() {
        return {
            carrierCtrl: ['', Validators.required],
            plantypeCtrl: ['', Validators.required],
            planpriorityCtrl: ['', Validators.required],
            dayperiodCtrl: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            plannumberCtrl: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        };
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
            const countryCodeArr = this.attachCountryCodesFormGroup.get('codes').value;

            for ( let i = 0; i < countryCodeArr.length; i++ ) {
                const ori_cc = countryCodeArr[i].originationCtrl;
                const destinationLen = countryCodeArr[i].destinationCtrl.length;
                for ( let x = 0; x < destinationLen; x++ ) {
                    this.finalCodesObj.push(
                        {
                            ori_cc: parseInt(ori_cc, 0),
                            des_cc: parseInt(countryCodeArr[i].destinationCtrl[x], 0),
                            carrier_code: this.attachCodesFormGroup.get('carrierCtrl').value,
                            planType: this.attachCodesFormGroup.get('plantypeCtrl').value,
                            priority: this.attachCodesFormGroup.get('planpriorityCtrl').value,
                            day_period: parseInt(this.attachCodesFormGroup.get('dayperiodCtrl').value, 0),
                            planNumber: parseInt(this.attachCodesFormGroup.get('plannumberCtrl').value, 0)
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
            this.closeDialog();
        }

        post_attachCodes() {
            for ( let i = 0; i < this.finalCodesObj.length; i++) {
                this.post_attachCallPlanCodes(this.currentRowId, this.finalCodesObj[i]);
            }
        }

        closeDialog(): void { // close dialog
            this.dialogRef.close();
        }

}
