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
var carrier_api_service_1 = require("./../../../../shared/api-services/carrier/carrier.api.service");
var carrier_shared_service_1 = require("./../../../../shared/services/carrier/carrier.shared.service");
var snackbar_shared_service_1 = require("./../../../../shared/services/global/snackbar.shared.service");
var DelCarrierDialogComponent = /** @class */ (function () {
    function DelCarrierDialogComponent(dialogRef, data, carrierService, carrierSharedService, snackbarSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.carrierService = carrierService;
        this.carrierSharedService = carrierSharedService;
        this.snackbarSharedService = snackbarSharedService;
    }
    DelCarrierDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.carrierSharedService.currentRowObj.subscribe(function (receivedRowID) { return _this.rowObj = receivedRowID; });
    };
    /*
        ~~~~~~~~~~ API Service ~~~~~~~~~~
    */
    DelCarrierDialogComponent.prototype.del_carrier = function (rowId) {
        var _this = this;
        this.carrierService.del_DeleteRow(rowId)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Carrier successfully deleted.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Carrier failed to delete.', 2000);
        });
    };
    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    DelCarrierDialogComponent.prototype.click_delCarrier = function () {
        this.del_multipleCarriers();
        this.closeDialog();
    };
    DelCarrierDialogComponent.prototype.del_multipleCarriers = function () {
        var rowId;
        for (var i = 0; i < this.rowObj.length; i++) {
            rowId = this.rowObj[i].id;
            this.del_carrier(rowId);
        }
    };
    DelCarrierDialogComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DelCarrierDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-del-carrier-dialog-inner',
            templateUrl: './del-carrier-dialog.component.html',
            styleUrls: ['./del-carrier-dialog.component.scss'],
            providers: [carrier_api_service_1.CarrierService],
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, carrier_api_service_1.CarrierService,
            carrier_shared_service_1.CarrierSharedService,
            snackbar_shared_service_1.SnackbarSharedService])
    ], DelCarrierDialogComponent);
    return DelCarrierDialogComponent;
}());
exports.DelCarrierDialogComponent = DelCarrierDialogComponent;
//# sourceMappingURL=del-carrier-dialog.component.js.map