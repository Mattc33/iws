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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var call_plan_api_service_1 = require("../../../services/call-plan.api.service");
var call_plan_shared_service_1 = require("./../../../services/call-plan.shared.service");
var carrier_api_service_1 = require("./../../../../shared/api-services/carrier/carrier.api.service");
var codes_shared_service_1 = require("./../../../../shared/services/global/codes.shared.service");
var attach_callplan_codes_shared_service_1 = require("./../../../../shared/services/callplan/attach-callplan-codes.shared.service");
var snackbar_shared_service_1 = require("./../../../../shared/services/global/snackbar.shared.service");
var AddCodeComponent = /** @class */ (function () {
    function AddCodeComponent(dialogRef, data, formBuilder, callPlanService, callPlanSharedService, carrierService, codesSharedService, codesFormSharedService, _snackbar) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.carrierService = carrierService;
        this.codesSharedService = codesSharedService;
        this.codesFormSharedService = codesFormSharedService;
        this._snackbar = _snackbar;
        // Form Data
        this.callPlanObj = [];
        this.carrierCodesObj = [];
        // Service props
        this.finalCodesObj = [];
    }
    AddCodeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_CarrierCodes();
        this.initCodesFormData();
        this.initCodesFormGroup();
        this.callPlanSharedService.currentRowAll.subscribe(function (data) { return _this.currentRowId = data; });
    };
    // ================================================================================
    // API services
    // ================================================================================
    AddCodeComponent.prototype.get_CarrierCodes = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) {
            console.log(data);
            _this.extractCarrierCodes(data);
        }, function (error) { console.log(error); });
    };
    AddCodeComponent.prototype.post_attachCallPlanCodes = function (callplanId, body) {
        var _this = this;
        this.callPlanService.post_newPlanCode(callplanId, body).subscribe(function (resp) {
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
    // Init Forms & Form Data
    // ================================================================================
    AddCodeComponent.prototype.initCodesFormData = function () {
        this.countryCodeList = this.codesSharedService.getCountryCodes();
        this.codePlanTypes = this.codesFormSharedService.provideCodePlanTypes();
        this.planPriorityList = this.codesFormSharedService.providePriorityList();
    };
    AddCodeComponent.prototype.initCodesFormGroup = function () {
        this.attachCodesFormGroup = this.formBuilder.group(this.buildAttachCodesFormGroup());
        this.attachCountryCodesFormGroup = this.formBuilder.group({
            codes: this.formBuilder.array([
                this.initCountryCodeFormGroup()
            ])
        });
    };
    AddCodeComponent.prototype.buildAttachCodesFormGroup = function () {
        return {
            carrierCtrl: ['', forms_1.Validators.required],
            plantypeCtrl: ['', forms_1.Validators.required],
            planpriorityCtrl: ['', forms_1.Validators.required],
            dayperiodCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]*$')]],
            plannumberCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]*$')]]
        };
    };
    /*
        ~~~~~~~~~~ Extract Data from JSON into input Format ~~~~~~~~~~
    */
    AddCodeComponent.prototype.extractCarrierCodes = function (data) {
        for (var i = 0; i < data.length; i++) {
            this.carrierCodesObj.push({ code: data[i].code, carrier: data[i].name });
        }
    };
    AddCodeComponent.prototype.insertDummyDataCodes = function () {
        this.attachCodesFormGroup.get('plantypeCtrl').setValue(0);
        this.attachCodesFormGroup.get('planpriorityCtrl').setValue(1);
        this.attachCodesFormGroup.get('dayperiodCtrl').setValue(27);
        this.attachCodesFormGroup.get('plannumberCtrl').setValue(1);
    };
    /*
        ~~~~~~~~~~ Form related UI ~~~~~~~~~~
    */
    AddCodeComponent.prototype.initCountryCodeFormGroup = function () {
        return this.formBuilder.group({
            originationCtrl: ['', forms_1.Validators.required],
            destinationCtrl: ['', forms_1.Validators.required]
        });
    };
    AddCodeComponent.prototype.onSelectChangeDest = function (params) {
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
    AddCodeComponent.prototype.addCodes = function () {
        var control = this.attachCountryCodesFormGroup.controls['codes'];
        control.push(this.initCountryCodeFormGroup());
    };
    AddCodeComponent.prototype.removeAddress = function (index) {
        var control = this.attachCountryCodesFormGroup.controls['codes'];
        control.removeAt(index);
    };
    AddCodeComponent.prototype.codesObjBuilder = function () {
        var countryCodeArr = this.attachCountryCodesFormGroup.get('codes').value;
        for (var i = 0; i < countryCodeArr.length; i++) {
            var ori_cc = countryCodeArr[i].originationCtrl;
            var destinationLen = countryCodeArr[i].destinationCtrl.length;
            for (var x = 0; x < destinationLen; x++) {
                this.finalCodesObj.push({
                    ori_cc: parseInt(ori_cc, 0),
                    des_cc: parseInt(countryCodeArr[i].destinationCtrl[x], 0),
                    carrier_code: this.attachCodesFormGroup.get('carrierCtrl').value,
                    planType: this.attachCodesFormGroup.get('plantypeCtrl').value,
                    priority: this.attachCodesFormGroup.get('planpriorityCtrl').value,
                    day_period: parseInt(this.attachCodesFormGroup.get('dayperiodCtrl').value, 0),
                    planNumber: parseInt(this.attachCodesFormGroup.get('plannumberCtrl').value, 0)
                });
            }
        }
    };
    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
    AddCodeComponent.prototype.click_attachCodes = function () {
        this.post_attachCodes();
        this.closeDialog();
    };
    AddCodeComponent.prototype.post_attachCodes = function () {
        for (var i = 0; i < this.finalCodesObj.length; i++) {
            this.post_attachCallPlanCodes(this.currentRowId, this.finalCodesObj[i]);
        }
    };
    AddCodeComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    AddCodeComponent = __decorate([
        core_1.Component({
            selector: 'app-add-code',
            templateUrl: './add-code.component.html',
            styleUrls: ['./add-code.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, forms_1.FormBuilder,
            call_plan_api_service_1.CallPlanService,
            call_plan_shared_service_1.CallPlanSharedService,
            carrier_api_service_1.CarrierService,
            codes_shared_service_1.CodesSharedService,
            attach_callplan_codes_shared_service_1.CodesFormSharedService,
            snackbar_shared_service_1.SnackbarSharedService])
    ], AddCodeComponent);
    return AddCodeComponent;
}());
exports.AddCodeComponent = AddCodeComponent;
//# sourceMappingURL=add-code.component.js.map