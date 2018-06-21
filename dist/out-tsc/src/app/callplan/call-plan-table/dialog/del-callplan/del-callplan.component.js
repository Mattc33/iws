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
var DelCallPlanComponent = /** @class */ (function () {
    function DelCallPlanComponent(dialogRef, data, callPlanService, callPlanSharedServce) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.callPlanService = callPlanService;
        this.callPlanSharedServce = callPlanSharedServce;
        this.event_onDel = new core_1.EventEmitter;
    }
    DelCallPlanComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.callPlanSharedServce.currentRowAll
            .subscribe(function (receivedRowId) { return _this.rowIdAll = receivedRowId; });
    };
    DelCallPlanComponent.prototype.click_delCallPlan = function () {
        this.del_delCallPlan();
        this.aggrid_delCallPlan();
        this.closeDialog();
    };
    DelCallPlanComponent.prototype.aggrid_delCallPlan = function () {
        this.event_onDel.emit('del-callplan');
    };
    DelCallPlanComponent.prototype.del_delCallPlan = function () {
        this.callPlanService.del_callPlan(this.rowIdAll)
            .subscribe(function (resp) { return console.log(resp); });
    };
    // On method call close dialog
    DelCallPlanComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DelCallPlanComponent = __decorate([
        core_1.Component({
            selector: 'app-del-callplan',
            templateUrl: './del-callplan.component.html',
            styleUrls: ['./del-callplan.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, call_plan_api_service_1.CallPlanService,
            call_plan_shared_service_1.CallPlanSharedService])
    ], DelCallPlanComponent);
    return DelCallPlanComponent;
}());
exports.DelCallPlanComponent = DelCallPlanComponent;
//# sourceMappingURL=del-callplan.component.js.map