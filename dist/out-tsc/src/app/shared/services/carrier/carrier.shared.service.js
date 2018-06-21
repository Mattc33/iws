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
var CarrierSharedService = /** @class */ (function () {
    function CarrierSharedService() {
        // example of services to communicate between sibling components
        // https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/
        // https://stackblitz.com/edit/sharing-data-any-comp?file=main.ts <- simplified example
        // Passing rowID from carrier-table => delete dialog
        this.rowObjSource = new rxjs_1.BehaviorSubject({});
        this.currentRowObj = this.rowObjSource.asObservable();
    }
    CarrierSharedService.prototype.changeRowObj = function (rowId) {
        this.rowObjSource.next(rowId);
        console.log('updated rowId: ' + rowId);
    };
    CarrierSharedService = __decorate([
        core_1.Injectable()
    ], CarrierSharedService);
    return CarrierSharedService;
}());
exports.CarrierSharedService = CarrierSharedService;
//# sourceMappingURL=carrier.shared.service.js.map