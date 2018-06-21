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
var RateCardsSharedService = /** @class */ (function () {
    function RateCardsSharedService() {
        this.rowObjAllSource = new rxjs_1.BehaviorSubject({}); // Passing rowObj from ratecard-all-table => delete dialog
        this.currentRowAllObj = this.rowObjAllSource.asObservable();
        this.rowRatesObjSource = new rxjs_1.BehaviorSubject({}); // Passing rates rowObj from rate table => delete dialog
        this.currentRowRatesObj = this.rowRatesObjSource.asObservable();
        this.rowTrunksObjSource = new rxjs_1.BehaviorSubject({}); // Passing trunks rowObj from trunks table => delete dialog
        this.currentRowTrunksObj = this.rowTrunksObjSource.asObservable();
    }
    RateCardsSharedService.prototype.changeRowAllObj = function (rowObj) {
        this.rowObjAllSource.next(rowObj);
        console.table(rowObj);
    };
    RateCardsSharedService.prototype.changeRowRatesObj = function (rowObj) {
        this.rowRatesObjSource.next(rowObj);
        console.table(rowObj);
    };
    RateCardsSharedService.prototype.changeRowTrunksObj = function (rowObj) {
        this.rowTrunksObjSource.next(rowObj);
        console.table(rowObj);
    };
    RateCardsSharedService = __decorate([
        core_1.Injectable()
    ], RateCardsSharedService);
    return RateCardsSharedService;
}());
exports.RateCardsSharedService = RateCardsSharedService;
//# sourceMappingURL=rate-cards.shared.service.js.map