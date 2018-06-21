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
var carrier_api_service_1 = require("./../../../../shared/api-services/carrier/carrier.api.service");
var snackbar_shared_service_1 = require("./../../../../shared/services/global/snackbar.shared.service");
var AddCarrierDialogComponent = /** @class */ (function () {
    function AddCarrierDialogComponent(dialogRef, data, formBuilder, carrierService, snackbarSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.carrierService = carrierService;
        this.snackbarSharedService = snackbarSharedService;
        // Input Props
        this.taxableOptions = [
            { value: false, viewValue: 'No' },
            { value: true, viewValue: 'Yes' },
        ];
        this.tierOptions = [
            { value: 1, viewValue: 'Tier 1' },
            { value: 2, viewValue: 'Tier 2' },
            { value: 3, viewValue: 'Tier 3' },
            { value: 4, viewValue: 'Tier 4' },
            { value: 5, viewValue: 'Tier 5' },
        ];
    }
    AddCarrierDialogComponent.prototype.ngOnInit = function () {
        this.addCarrierFormGroup = this.formBuilder.group({
            nameCtrl: ['', forms_1.Validators.required],
            emailCtrl: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            addressCtrl: ['', forms_1.Validators.required],
            phoneCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[0-9]+$')]],
            taxableCtrl: ['', forms_1.Validators.required],
            tierCtrl: ['', forms_1.Validators.required],
            codeCtrl: ['', [forms_1.Validators.required, forms_1.Validators.pattern('[A-Z]{3}')]]
        });
    };
    /*
        ~~~~~~~~~~ Services ~~~~~~~~~~
    */
    AddCarrierDialogComponent.prototype.post_addCarrier = function (body) {
        var _this = this;
        this.carrierService.post_AddRow(body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Carrier successfully inserted.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Carrier failed to insert.', 2000);
        });
    };
    /*
        ~~~~~~~~~~ Form Obj from Input ~~~~~~~~~~
    */
    AddCarrierDialogComponent.prototype.formCarrierObj = function () {
        this.finalCarrierObj = {
            code: this.addCarrierFormGroup.get('codeCtrl').value,
            name: this.addCarrierFormGroup.get('nameCtrl').value,
            email: this.addCarrierFormGroup.get('emailCtrl').value,
            phone: this.addCarrierFormGroup.get('phoneCtrl').value,
            address: this.addCarrierFormGroup.get('addressCtrl').value,
            taxable: this.addCarrierFormGroup.get('taxableCtrl').value,
            tier: this.addCarrierFormGroup.get('tierCtrl').value
        };
    };
    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    AddCarrierDialogComponent.prototype.click_addCarrier = function (post) {
        this.post_addCarrier(this.finalCarrierObj);
        this.closeDialog();
    };
    AddCarrierDialogComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    AddCarrierDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-add-carrier-dialog-inner',
            templateUrl: './add-carrier-dialog.component.html',
            styleUrls: ['./add-carrier-dialog.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, forms_1.FormBuilder,
            carrier_api_service_1.CarrierService,
            snackbar_shared_service_1.SnackbarSharedService])
    ], AddCarrierDialogComponent);
    return AddCarrierDialogComponent;
}());
exports.AddCarrierDialogComponent = AddCarrierDialogComponent;
//# sourceMappingURL=add-carrier-dialog.component.js.map