"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var CallPlanSharedService = /** @class */ (function () {
    function CallPlanSharedService() {
        // Passing rowIdAll from callplan-all-table => delete dialog
        this.rowAllSource = new rxjs_1.BehaviorSubject(0);
        this.currentRowAll = this.rowAllSource.asObservable();
        // Passing rowObj Ratecards from callplan-ratecards-table => dettach ratecards dialog
        this.rowRatecardsObjSource = new rxjs_1.BehaviorSubject({});
        this.currentRatecardsObj = this.rowRatecardsObjSource.asObservable();
        // Passing rowObj codes from callplan-ratecards-table => dettach ratecards dialog
        this.rowCodesObjSource = new rxjs_1.BehaviorSubject({});
        this.currentCodesObj = this.rowCodesObjSource.asObservable();
        // Passing Call Plan Object
        this.callPlanObjSource = new rxjs_1.BehaviorSubject({});
        this.currentCallPlanObj = this.callPlanObjSource.asObservable();
    }
    CallPlanSharedService.prototype.changeRowAll = function (rowAllId) {
        this.rowAllSource.next(rowAllId);
    };
    CallPlanSharedService.prototype.changeRowRatecards = function (rowRatecardsObj) {
        this.rowRatecardsObjSource.next(rowRatecardsObj);
    };
    CallPlanSharedService.prototype.changeRowCodes = function (rowCodesObj) {
        this.rowCodesObjSource.next(rowCodesObj);
    };
    CallPlanSharedService.prototype.changeCallPlanObj = function (callPlanObj) {
        this.callPlanObjSource.next(callPlanObj);
    };
    CallPlanSharedService = __decorate([
        core_1.Injectable()
    ], CallPlanSharedService);
    return CallPlanSharedService;
}());
exports.CallPlanSharedService = CallPlanSharedService;
//# sourceMappingURL=call-plan.shared.service.js.map