import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { GridApi } from 'ag-grid';

import { CallPlanService } from '../../../shared/api-services/callplan/call-plan.api.service';
import { CallPlanSharedService } from '../../../shared/services/callplan/call-plan.shared.service';
import { CarrierService } from '../../../shared/api-services/carrier/carrier.api.service';
import { CodesSharedService } from '../../../shared/services/global/codes.shared.service';
import { ToggleButtonStateService } from '../../../shared/services/global/buttonStates.shared.service';
import { SnackbarSharedService } from '../../../shared/services/global/snackbar.shared.service';
import { CodesFormSharedService } from '../../../shared/services/callplan/attach-callplan-codes.shared.service';

@Component({
  selector: 'app-call-plan-add-code',
  templateUrl: './call-plan-add-code.component.html',
  styleUrls: ['./call-plan-add-code.component.scss']
})
export class CallPlanAddCodeComponent implements OnInit {

    // AG Grid
    rowDataCallplan; columnDefsCallplan;

    gridApiCallplan: GridApi;
    rowSelectionS = 'single';

    gridSelectionStatus: number;

    // Form Group
    addCodeInfoFormGroup: FormGroup;
    attachCodesFormGroup: FormGroup;
    attachCountryCodesFormGroup: FormGroup;

    // Form Data
    codePlanTypes;
    planPriorityList;
    countryCodeList;
    carrierInfo;
    finalCodesObj = [];

    // Class data
    callplanId;

    constructor(
        private callplanService: CallPlanService,
        private carrierService: CarrierService,
        private _codes: CodesSharedService,
        private _toggleButton: ToggleButtonStateService,
        private _snackbar: SnackbarSharedService,
        private _formBuilder: FormBuilder,
        private _codesForm: CodesFormSharedService
    ) {
        this.columnDefsCallplan = this.createColumnDefsCallplan();
    }

    ngOnInit() {
        this.get_allCallplan();
        this.get_allCarrier();
        this.initCodesFormData();
        this.initCodesformGroup();
    }

    // ================================================================================
    // Attach Codes API
    // ================================================================================
    get_allCallplan() {
        this.callplanService.get_allCallplan().subscribe(
            data => {
                this.rowDataCallplan = data;
            }
        );
    }

    get_allCarrier() {
        this.carrierService.get_carriers().subscribe(
            data => {
                this.carrierInfo = data;
                console.log(data);
            }
        );
    }

    post_attachNewCode(callplanId: number, body: any) {
        this.callplanService.post_newPlanCode(callplanId, body).subscribe(
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
    // Form Data & Form Groups
    // ================================================================================
    initCodesFormData() {
        this.countryCodeList = this._codes.getCountryCodes();
        this.codePlanTypes = this._codesForm.provideCodePlanTypes();
        this.planPriorityList = this._codesForm.providePriorityList();
    }

    initCodesformGroup() {
        this.addCodeInfoFormGroup = this._formBuilder.group(this.buildAddCodeInfoFormGroup());
        this.attachCodesFormGroup = this._formBuilder.group({
            codes: this._formBuilder.array([
                this.buildCountryCodeFormGroup()
            ])
        });
    }

    buildAddCodeInfoFormGroup() {
        return {
            carrierCtrl: ['', Validators.required],
            plantypeCtrl: ['', Validators.required],
            planpriorityCtrl: ['', Validators.required],
            dayperiodCtrl: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            plannumberCtrl: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        };
    }

    buildCountryCodeFormGroup() {
        return this._formBuilder.group({
            originationCtrl: ['', Validators.required],
            destinationCtrl: ['', Validators.required]
        });
    }

    // ================================================================================
    // AG Grid Init
    // ================================================================================
    onGridReadyCallplan(params) {
        this.gridApiCallplan = params.api;
        params.api.sizeColumnsToFit();
    }

    createColumnDefsCallplan() {
        return [
            {
                headerName: 'Call Plan', field: 'title',
                checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Available', field: 'available',
            }
        ];
    }

    // ================================================================================
    // AG Grid UI
    // ================================================================================
    onGridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    onSelectionChanged(params) {
        this.callplanId = this.gridApiCallplan.getSelectedRows()[0].id;
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

    // ================================================================================
    // Form Controls
    // ================================================================================
    addCodes(): void {
        const control = <FormArray>this.attachCodesFormGroup.controls['codes'];
            control.push(this.buildCountryCodeFormGroup ());
    }

    removeAddress(index: number) {
        const control = <FormArray>this.attachCodesFormGroup.controls['codes'];
            control.removeAt(index);
    }

    codesObjBuilder() {
        const countryCodeArr = this.attachCodesFormGroup.get('codes').value;

        for ( let i = 0; i < countryCodeArr.length; i++ ) {
            const ori_cc = countryCodeArr[i].originationCtrl;
            const destinationLen = countryCodeArr[i].destinationCtrl.length;
            for ( let x = 0; x < destinationLen; x++ ) {
                this.finalCodesObj.push(
                    {
                        ori_cc: parseInt(ori_cc, 0),
                        des_cc: parseInt(countryCodeArr[i].destinationCtrl[x], 0),
                        carrier_code: this.addCodeInfoFormGroup.get('carrierCtrl').value,
                        planType: this.addCodeInfoFormGroup.get('plantypeCtrl').value,
                        priority: this.addCodeInfoFormGroup.get('planpriorityCtrl').value,
                        day_period: parseInt(this.addCodeInfoFormGroup.get('dayperiodCtrl').value, 0),
                        planNumber: parseInt(this.addCodeInfoFormGroup.get('plannumberCtrl').value, 0)
                    },
                );
            }
        }
    }

    click_attachCodes() {
        for ( let i = 0; i < this.finalCodesObj.length; i++) {
            this.post_attachNewCode(this.callplanId, this.finalCodesObj[i]);
        }

        this.resetForms();
    }

    resetForms() {
        this.addCodeInfoFormGroup.reset();
        this.attachCodesFormGroup.reset();
        this.finalCodesObj = [];
    }

    insertDummyDataCodes() {
        this.addCodeInfoFormGroup.get('plantypeCtrl').setValue(0);
        this.addCodeInfoFormGroup.get('planpriorityCtrl').setValue(1);
        this.addCodeInfoFormGroup.get('dayperiodCtrl').setValue(27);
        this.addCodeInfoFormGroup.get('plannumberCtrl').setValue(1);
    }


}
