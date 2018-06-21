"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var call_plan_api_service_1 = require("./../services/call-plan.api.service");
var carrier_api_service_1 = require("./../../shared/api-services/carrier/carrier.api.service");
var codes_shared_service_1 = require("./../../shared/services/global/codes.shared.service");
var buttonStates_shared_service_1 = require("./../../shared/services/global/buttonStates.shared.service");
var snackbar_shared_service_1 = require("./../../shared/services/global/snackbar.shared.service");
var attach_callplan_codes_shared_service_1 = require("./../../shared/services/callplan/attach-callplan-codes.shared.service");
var CallPlanAddCodeComponent = /** @class */ (function () {
    function CallPlanAddCodeComponent(callplanService, carrierService, _codes, _toggleButton, _snackbar, _formBuilder, _codesForm) {
        this.callplanService = callplanService;
        this.carrierService = carrierService;
        this._codes = _codes;
        this._toggleButton = _toggleButton;
        this._snackbar = _snackbar;
        this._formBuilder = _formBuilder;
        this._codesForm = _codesForm;
        this.rowSelectionS = 'single';
        this.finalCodesObj = [];
        this.columnDefsCallplan = this.createColumnDefsCallplan();
    }
    CallPlanAddCodeComponent.prototype.ngOnInit = function () {
        this.get_allCallplan();
        this.get_allCarrier();
        this.initCodesFormData();
        this.initCodesformGroup();
    };
    // ================================================================================
    // Attach Codes API
    // ================================================================================
    CallPlanAddCodeComponent.prototype.get_allCallplan = function () {
        var _this = this;
        this.callplanService.get_allCallplan().subscribe(function (data) {
            _this.rowDataCallplan = data;
        });
    };
    CallPlanAddCodeComponent.prototype.get_allCarrier = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) {
            _this.carrierInfo = data;
            console.log(data);
        });
    };
    CallPlanAddCodeComponent.prototype.post_attachNewCode = function (callplanId, body) {
        var _this = this;
        this.callplanService.post_newPlanCode(callplanId, body).subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Codes Attached Successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error('Codes Attached failed.', 2000);
        });
    };
    // ================================================================================
    // Form Data & Form Groups
    // ================================================================================
    CallPlanAddCodeComponent.prototype.initCodesFormData = function () {
        this.countryCodeList = this._codes.getCountryCodes();
        this.codePlanTypes = this._codesForm.provideCodePlanTypes();
        this.planPriorityList = this._codesForm.providePriorityList();
    };
    CallPlanAddCodeComponent.prototype.initCodesformGroup = function () {
        this.addCodeInfoFormGroup = this._formBuilder.group(this.buildAddCodeInfoFormGroup());
        this.attachCodesFormGroup = this._formBuilder.group({
            codes: this._formBuilder.array([
                this.buildCountryCodeFormGroup()
            ])
        });
    };
    CallPlanAddCodeComponent.prototype.buildAddCodeInfoFormGroup = function () {
        return {
            carrierCtrl: ['', forms_1.Validators.required],
            plantypeCtrl: ['', forms_1.Validators.required],
            planpriorityCtrl: ['', forms_1.Validators.required],
            dayperiodCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]*$')]],
            plannumberCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]*$')]]
        };
    };
    CallPlanAddCodeComponent.prototype.buildCountryCodeFormGroup = function () {
        return this._formBuilder.group({
            originationCtrl: ['', forms_1.Validators.required],
            destinationCtrl: ['', forms_1.Validators.required]
        });
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    CallPlanAddCodeComponent.prototype.onGridReadyCallplan = function (params) {
        this.gridApiCallplan = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanAddCodeComponent.prototype.createColumnDefsCallplan = function () {
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
    };
    // ================================================================================
    // AG Grid UI
    // ================================================================================
    CallPlanAddCodeComponent.prototype.onGridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    CallPlanAddCodeComponent.prototype.onSelectionChanged = function (params) {
        this.callplanId = this.gridApiCallplan.getSelectedRows()[0].id;
    };
    CallPlanAddCodeComponent.prototype.onSelectChangeDest = function (params) {
        var formArrLen = this.attachCountryCodesFormGroup.get('codes').value.length;
        for (var i = 0; i < formArrLen; i++) {
            var destinationCtrl = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl').value;
            for (var x = 0; x < destinationCtrl.length; x++) {
                var destinationSetValue = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl');
                if (destinationCtrl[0] === '0') {
                    destinationSetValue.setValue(['0']);
                }
            }
        }
    };
    // ================================================================================
    // Form Controls
    // ================================================================================
    CallPlanAddCodeComponent.prototype.addCodes = function () {
        var control = this.attachCodesFormGroup.controls['codes'];
        control.push(this.buildCountryCodeFormGroup());
    };
    CallPlanAddCodeComponent.prototype.removeAddress = function (index) {
        var control = this.attachCodesFormGroup.controls['codes'];
        control.removeAt(index);
    };
    CallPlanAddCodeComponent.prototype.codesObjBuilder = function () {
        var countryCodeArr = this.attachCodesFormGroup.get('codes').value;
        for (var i = 0; i < countryCodeArr.length; i++) {
            var ori_cc = countryCodeArr[i].originationCtrl;
            var destinationLen = countryCodeArr[i].destinationCtrl.length;
            for (var x = 0; x < destinationLen; x++) {
                this.finalCodesObj.push({
                    ori_cc: parseInt(ori_cc, 0),
                    des_cc: parseInt(countryCodeArr[i].destinationCtrl[x], 0),
                    carrier_code: this.addCodeInfoFormGroup.get('carrierCtrl').value,
                    planType: this.addCodeInfoFormGroup.get('plantypeCtrl').value,
                    priority: this.addCodeInfoFormGroup.get('planpriorityCtrl').value,
                    day_period: parseInt(this.addCodeInfoFormGroup.get('dayperiodCtrl').value, 0),
                    planNumber: parseInt(this.addCodeInfoFormGroup.get('plannumberCtrl').value, 0)
                });
            }
        }
    };
    CallPlanAddCodeComponent.prototype.click_attachCodes = function () {
        for (var i = 0; i < this.finalCodesObj.length; i++) {
            this.post_attachNewCode(this.callplanId, this.finalCodesObj[i]);
        }
        this.resetForms();
    };
    CallPlanAddCodeComponent.prototype.resetForms = function () {
        this.addCodeInfoFormGroup.reset();
        this.attachCodesFormGroup.reset();
        this.finalCodesObj = [];
    };
    CallPlanAddCodeComponent.prototype.insertDummyDataCodes = function () {
        this.addCodeInfoFormGroup.get('plantypeCtrl').setValue(0);
        this.addCodeInfoFormGroup.get('planpriorityCtrl').setValue(1);
        this.addCodeInfoFormGroup.get('dayperiodCtrl').setValue(27);
        this.addCodeInfoFormGroup.get('plannumberCtrl').setValue(1);
    };
    CallPlanAddCodeComponent = __decorate([
        core_1.Component({
            selector: 'app-call-plan-add-code',
            templateUrl: './call-plan-add-code.component.html',
            styleUrls: ['./call-plan-add-code.component.scss']
        }),
        __metadata("design:paramtypes", [call_plan_api_service_1.CallPlanService,
            carrier_api_service_1.CarrierService,
            codes_shared_service_1.CodesSharedService,
            buttonStates_shared_service_1.ToggleButtonStateService,
            snackbar_shared_service_1.SnackbarSharedService,
            forms_1.FormBuilder,
            attach_callplan_codes_shared_service_1.CodesFormSharedService])
    ], CallPlanAddCodeComponent);
    return CallPlanAddCodeComponent;
}());
exports.CallPlanAddCodeComponent = CallPlanAddCodeComponent;
//# sourceMappingURL=call-plan-add-code.component.js.map