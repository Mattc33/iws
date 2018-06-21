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
var call_plan_api_service_1 = require("../../../services/call-plan.api.service");
var call_plan_shared_service_1 = require("../../../services/call-plan.shared.service");
var snackbar_shared_service_1 = require("./../../../../shared/services/global/snackbar.shared.service");
var DettachRatecardsComponent = /** @class */ (function () {
    function DettachRatecardsComponent(dialogRef, data, callPlanService, callPlanSharedServce, _snackbar) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.callPlanService = callPlanService;
        this.callPlanSharedServce = callPlanSharedServce;
        this._snackbar = _snackbar;
        this.event_onDettach = new core_1.EventEmitter;
    }
    DettachRatecardsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.callPlanSharedServce.currentRowAll.subscribe(function (receivedRowId) { return _this.rowIdAll = receivedRowId; });
        this.callPlanSharedServce.currentRatecardsObj.subscribe(function (receivedRowObj) { return _this.rowObjRatecards = receivedRowObj; });
    };
    DettachRatecardsComponent.prototype.click_dettachRatecards = function () {
        this.del_detachRatecards();
        this.aggrid_dettachratecards();
        this.closeDialog();
    };
    DettachRatecardsComponent.prototype.aggrid_dettachratecards = function () {
        this.event_onDettach.emit('detach-ratecards');
    };
    DettachRatecardsComponent.prototype.del_detachRatecards = function () {
        var _this = this;
        var rowRatecardsId;
        for (var i = 0; i < this.rowObjRatecards.length; i++) {
            rowRatecardsId = this.rowObjRatecards[i].id;
            this.callPlanService.del_detachRateCard(this.rowIdAll, rowRatecardsId)
                .subscribe(function (resp) {
                console.log(resp);
                if (resp.status === 200) {
                    _this._snackbar.snackbar_success('Ratecard Delete Successful.', 2000);
                }
            }, function (error) {
                console.log(error);
                _this._snackbar.snackbar_error('Ratecard Delete Failed.', 2000);
            });
        }
    };
    DettachRatecardsComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DettachRatecardsComponent = __decorate([
        core_1.Component({
            selector: 'app-dettach-ratecards',
            templateUrl: './dettach-ratecards.component.html',
            styleUrls: ['./dettach-ratecards.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, call_plan_api_service_1.CallPlanService,
            call_plan_shared_service_1.CallPlanSharedService,
            snackbar_shared_service_1.SnackbarSharedService])
    ], DettachRatecardsComponent);
    return DettachRatecardsComponent;
}());
exports.DettachRatecardsComponent = DettachRatecardsComponent;
//# sourceMappingURL=dettach-ratecards.component.js.map