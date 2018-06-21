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
var ImporterSharedService = /** @class */ (function () {
    function ImporterSharedService() {
        this.postTableObjSource = new rxjs_1.BehaviorSubject([]);
        this.currentPostTableObj = this.postTableObjSource.asObservable();
        this.postRatesCSVAmount = new rxjs_1.BehaviorSubject(0);
        this.currentRatesCSVAmount = this.postRatesCSVAmount.asObservable();
    }
    ImporterSharedService.prototype.changePostTableObj = function (rowArr) {
        this.postTableObjSource.next(rowArr);
        console.log(rowArr);
    };
    ImporterSharedService.prototype.changeRatesCSVAmount = function (ratesAmount) {
        this.postRatesCSVAmount.next(ratesAmount);
        console.log(ratesAmount);
    };
    ImporterSharedService = __decorate([
        core_1.Injectable()
    ], ImporterSharedService);
    return ImporterSharedService;
}());
exports.ImporterSharedService = ImporterSharedService;
//# sourceMappingURL=importer.shared.service.js.map