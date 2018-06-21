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
var AddCallPlanComponent = /** @class */ (function () {
    function AddCallPlanComponent(dialogRef, data, formBuilder, callPlanService, callPlanSharedService, carrierService, codesSharedService, codesFormSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.carrierService = carrierService;
        this.codesSharedService = codesSharedService;
        this.codesFormSharedService = codesFormSharedService;
        // Events
        this.event_onAdd = new core_1.EventEmitter();
        // callplan
        this.carrierObj = [];
        this.promotion = [
            { name: 'Yes', value: true },
            { name: 'No', value: false },
        ];
        this.unlimitedPlanToggle = false;
        this.callPlanObj = [];
        // Patterns
        this.currencyPattern = /^\d+\.\d{2}$/;
        this.numPattern = '^[0-9]+$';
        this.codesPlanType = [
            { code: 0, name: 'Pay as you go' },
            { code: 1, name: 'Unlimited plan' },
            { code: 2, name: 'Minute plan' },
            { code: 3, name: 'Money plan' }
        ];
        this.planPriorityList = [
            { num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }, { num: 5 }, { num: 6 }, { num: 7 }, { num: 8 }, { num: 9 }
        ];
    }
    AddCallPlanComponent.prototype.ngOnInit = function () {
        this.countryCodeList = this.codesSharedService.getCountryCodes();
        this.initFormGroups();
        this.initFormData();
        this.get_CarrierCodes();
        this.attachCallPlanFormGroup.get('validthroughCtrl').disable();
    };
    /*
        ~~~~~~~~~~ Call API Service ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.get_CarrierCodes = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) { _this.extractCarrierNames(data); }, function (error) { console.log(error); });
    };
    AddCallPlanComponent.prototype.post_callPlan = function () {
        this.callPlanService.post_newCallPlan(this.finalCallPlanObj)
            .subscribe(function (resp) { return console.log(resp); });
    };
    // ================================================================================
    // Data Init
    // ================================================================================
    AddCallPlanComponent.prototype.initFormData = function () {
        this.status = this.codesFormSharedService.provideStatus();
        this.callplanPlanType = this.codesFormSharedService.provideCallplanPlanType();
        this.activeWhen = this.codesFormSharedService.provideActiveWhen();
    };
    AddCallPlanComponent.prototype.initFormGroups = function () {
        this.addCarrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['', forms_1.Validators.required]
        });
        this.attachCallPlanFormGroup = this.formBuilder.group(this.initAttachCallplanForms());
        this.attachCodesFormGroup = this.formBuilder.group(this.initAttachCodesForms());
        this.attachCountryCodesFormGroup = this.formBuilder.group({
            codes: this.formBuilder.array([
                this.initCountryCodeFormGroup()
            ])
        });
    };
    AddCallPlanComponent.prototype.initAttachCallplanForms = function () {
        return {
            titleCtrl: ['', forms_1.Validators.required],
            subtitleCtrl: [''],
            availableCtrl: ['', forms_1.Validators.required],
            validthroughCtrl: ['', forms_1.Validators.required],
            buypriceCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.currencyPattern)]],
            sellpriceCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.currencyPattern)]],
            dayperiodCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.numPattern)]],
            rankingCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.numPattern)]],
            plantypeCtrl: ['', forms_1.Validators.required],
            maxdestinationCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.numPattern)]],
            maxminutesCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.numPattern)]],
            activewhenCtrl: ['', forms_1.Validators.required],
            promoCtrl: ['', forms_1.Validators.required],
            descriptionCtrl: ['', forms_1.Validators.required]
        };
    };
    AddCallPlanComponent.prototype.initAttachCodesForms = function () {
        return {
            carrierCtrl: ['', forms_1.Validators.required],
            plantypeCtrl: ['', forms_1.Validators.required],
            planpriorityCtrl: ['', forms_1.Validators.required],
            dayperiodCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.numPattern)]],
            plannumberCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.numPattern)]]
        };
    };
    /*
        ~~~~~~~~~~ Extract Data from JSON into input format ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.extractCarrierNames = function (data) {
        for (var i = 0; i < data.length; i++) {
            this.carrierObj.push({ id: data[i].id, carrier: data[i].name, code: data[i].code });
        }
    };
    /*
        ~~~~~~~~~~ Form related UI Methods ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.onChangePlanType = function () {
        var planType = this.attachCallPlanFormGroup.get('plantypeCtrl').value;
        if (planType === 'UNLIMITED_CALL_PLAN') {
            return true;
        }
        else {
            return false;
        }
    };
    AddCallPlanComponent.prototype.initCountryCodeFormGroup = function () {
        return this.formBuilder.group({
            originationCtrl: ['', forms_1.Validators.required],
            destinationCtrl: ['', forms_1.Validators.required]
        });
    };
    AddCallPlanComponent.prototype.addCodes = function () {
        var control = this.attachCountryCodesFormGroup.controls['codes'];
        control.push(this.initCountryCodeFormGroup());
    };
    AddCallPlanComponent.prototype.removeGroup = function (index) {
        var control = this.attachCountryCodesFormGroup.controls['codes'];
        control.removeAt(index);
    };
    /*
        ~~~~~~~~~~ aggrid Event methods ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.aggrid_addCallPlan = function () {
        this.event_onAdd.emit(this.finalCallPlanObj);
    };
    /*
        ~~~~~~~~~~ Create Final Call Plan Object ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.pushStaticCallPlanFieldToObj = function () {
        var maxDestNumber;
        var maxMinutes;
        // check if maxdestination/maxminutes fields are skipped then assign them a value of 0 instead of being nulled
        if (this.attachCallPlanFormGroup.get('maxdestinationCtrl').value === '') {
            maxDestNumber = 0;
        }
        else {
            maxDestNumber = parseInt(this.attachCallPlanFormGroup.get('maxdestinationCtrl').value, 0);
        }
        if (this.attachCallPlanFormGroup.get('maxminutesCtrl').value === '') {
            maxMinutes = 0;
        }
        else {
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
    };
    AddCallPlanComponent.prototype.codesObjBuilder = function () {
        this.pushStaticCallPlanFieldToObj();
        var countryCodeArr = this.attachCountryCodesFormGroup.get('codes').value;
        for (var i = 0; i < countryCodeArr.length; i++) {
            var ori_cc = countryCodeArr[i].originationCtrl;
            var destinationLen = countryCodeArr[i].destinationCtrl.length;
            for (var x = 0; x < destinationLen; x++) {
                this.finalCallPlanObj.codes.push({
                    ori_cc: parseInt(ori_cc, 0),
                    dest_cc: parseInt(countryCodeArr[i].destinationCtrl[x], 0),
                    carrier_code: this.attachCodesFormGroup.get('carrierCtrl').value,
                    planType: this.attachCodesFormGroup.get('plantypeCtrl').value,
                    priority: this.attachCodesFormGroup.get('planpriorityCtrl').value,
                    day_period: this.attachCodesFormGroup.get('dayperiodCtrl').value,
                    planNumber: this.attachCodesFormGroup.get('plannumberCtrl').value
                });
            }
        }
    };
    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.onSelectChangeDest = function (params) {
        var formArrLen = this.attachCountryCodesFormGroup.get('codes').value.length;
        for (var i = 0; i < formArrLen; i++) {
            var destinationCtrl = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl').value;
            for (var x = 0; x < destinationCtrl.length; x++) {
                var destinationSetValue = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl');
                if (destinationCtrl[0] === '0') {
                    destinationSetValue.setValue(['0']);
                }
                else {
                }
            }
        }
    };
    AddCallPlanComponent.prototype.click_addCallPlan = function () {
        this.post_callPlan();
        this.aggrid_addCallPlan();
        this.closeDialog();
    };
    AddCallPlanComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    /*
        ~~~~~~~~~~ Test Data ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.insertDummyDataCallPlan = function () {
        var randomInt = Math.floor(Math.random() * Math.floor(1000));
        this.attachCallPlanFormGroup.get('titleCtrl').setValue("Random title " + randomInt);
        this.attachCallPlanFormGroup.get('subtitleCtrl').setValue("Random subtitle " + randomInt);
        this.attachCallPlanFormGroup.get('availableCtrl').setValue("available");
        this.attachCallPlanFormGroup.get('buypriceCtrl').setValue("1.11");
        this.attachCallPlanFormGroup.get('sellpriceCtrl').setValue("2.22");
        this.attachCallPlanFormGroup.get('dayperiodCtrl').setValue("27");
        this.attachCallPlanFormGroup.get('rankingCtrl').setValue("1");
        this.attachCallPlanFormGroup.get('plantypeCtrl').setValue("PAY_AS_YOU_GO_CALL_PLAN");
        this.attachCallPlanFormGroup.get('maxdestinationCtrl').setValue("0");
        this.attachCallPlanFormGroup.get('maxminutesCtrl').setValue("0");
        this.attachCallPlanFormGroup.get('activewhenCtrl').setValue("IMMEDIATELY");
        this.attachCallPlanFormGroup.get('promoCtrl').setValue(true);
        this.attachCallPlanFormGroup.get('descriptionCtrl').setValue('this is a description');
        console.log(this.attachCallPlanFormGroup.value);
    };
    AddCallPlanComponent.prototype.insertDummyDataCodes = function () {
        this.attachCodesFormGroup.get('carrierCtrl').setValue("OBT");
        this.attachCodesFormGroup.get('plantypeCtrl').setValue(0);
        this.attachCodesFormGroup.get('planpriorityCtrl').setValue(1);
        this.attachCodesFormGroup.get('dayperiodCtrl').setValue(27);
        this.attachCodesFormGroup.get('plannumberCtrl').setValue(1);
        console.log(this.attachCodesFormGroup.value);
    };
    AddCallPlanComponent = __decorate([
        core_1.Component({
            selector: 'app-add-callplan',
            templateUrl: './add-callplan.component.html',
            styleUrls: ['./add-callplan.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, forms_1.FormBuilder,
            call_plan_api_service_1.CallPlanService,
            call_plan_shared_service_1.CallPlanSharedService,
            carrier_api_service_1.CarrierService,
            codes_shared_service_1.CodesSharedService,
            attach_callplan_codes_shared_service_1.CodesFormSharedService])
    ], AddCallPlanComponent);
    return AddCallPlanComponent;
}());
exports.AddCallPlanComponent = AddCallPlanComponent;
//# sourceMappingURL=add-callplan.component.js.map