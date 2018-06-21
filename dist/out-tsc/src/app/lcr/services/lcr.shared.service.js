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
var LCRSharedService = /** @class */ (function () {
    function LCRSharedService() {
        this.source_providerJson = new rxjs_1.BehaviorSubject([]);
        this.current_providerJson = this.source_providerJson.asObservable();
    }
    LCRSharedService.prototype.change_providerJson = function (trunkJson) {
        this.source_providerJson.next(trunkJson);
    };
    LCRSharedService.prototype.get_rowDataWithProviderName = function (jsonToBeManipulated, providerData) {
        for (var i = 0; i < jsonToBeManipulated.length; i++) {
            for (var x = 0; x < providerData.length; x++) {
                if (jsonToBeManipulated[i].provider_id === providerData[x].id) {
                    Object.assign(jsonToBeManipulated[i], { provider_name: providerData[x].name });
                }
            }
        }
        return jsonToBeManipulated;
    };
    LCRSharedService = __decorate([
        core_1.Injectable()
    ], LCRSharedService);
    return LCRSharedService;
}());
exports.LCRSharedService = LCRSharedService;
//# sourceMappingURL=lcr.shared.service.js.map