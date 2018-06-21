"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CodesFormSharedService = /** @class */ (function () {
    function CodesFormSharedService() {
    }
    CodesFormSharedService.prototype.provideStatus = function () {
        return [
            { value: 'available' },
            { value: 'unavailable' },
            { value: 'deleted' },
            { value: 'staged' },
            { value: 'pending' }
        ];
    };
    CodesFormSharedService.prototype.provideCallplanPlanType = function () {
        return [
            { name: 'Unlimited', value: 'UNLIMITED_CALL_PLAN' },
            { name: 'Pay As You Go', value: 'PAY_AS_YOU_GO_CALL_PLAN' },
            { name: 'Minutes', value: 'MINUTES_CALL_PLAN' }
        ];
    };
    CodesFormSharedService.prototype.provideActiveWhen = function () {
        return [
            { name: 'Activated Immediately', value: 'IMMEDIATELY' },
            { name: 'Activated on a successful call', value: 'SUCCESS_CALL' }
        ];
    };
    CodesFormSharedService.prototype.providePromotion = function () {
        return [
            { name: 'Yes', value: true },
            { name: 'No', value: false }
        ];
    };
    CodesFormSharedService.prototype.provideCodePlanTypes = function () {
        return [
            { code: 0, name: 'Pay as you go' },
            { code: 1, name: 'Unlimited plan' },
            { code: 2, name: 'Minute plan' },
            { code: 3, name: 'Money plan' }
        ];
    };
    CodesFormSharedService.prototype.providePriorityList = function () {
        return [
            { num: 1 },
            { num: 2 },
            { num: 3 },
            { num: 4 },
            { num: 5 },
            { num: 6 },
            { num: 7 },
            { num: 8 },
            { num: 9 }
        ];
    };
    CodesFormSharedService = __decorate([
        core_1.Injectable()
    ], CodesFormSharedService);
    return CodesFormSharedService;
}());
exports.CodesFormSharedService = CodesFormSharedService;
//# sourceMappingURL=attach-callplan-codes.shared.service.js.map