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
var rate_cards_api_service_1 = require("./../../../../shared/api-services/ratecard/rate-cards.api.service");
var rate_cards_shared_service_1 = require("./../../../../shared/services/ratecard/rate-cards.shared.service");
var DetachTrunksComponent = /** @class */ (function () {
    function DetachTrunksComponent(dialogRef, data, rateCardsService, rateCardsSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.rateCardsService = rateCardsService;
        this.rateCardsSharedService = rateCardsSharedService;
        this.event_onDel = new core_1.EventEmitter;
    }
    DetachTrunksComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rateCardsSharedService.currentRowTrunksObj.subscribe(function (data) { return _this.rowRatesObj = data; });
        this.rateCardsSharedService.currentRowAllObj.subscribe(function (data) { return _this.ratecardId = data; });
    };
    DetachTrunksComponent.prototype.click_detachTrunks = function () {
        this.del_detachTrunks();
        this.aggrid_deleteTrunks();
        this.closeDialog();
    };
    ;
    DetachTrunksComponent.prototype.del_detachTrunks = function () {
        var trunksId;
        for (var i = 0; i < this.rowRatesObj.length; i++) {
            trunksId = this.rowRatesObj[i].id;
            this.rateCardsService.del_DetachTrunk(this.ratecardId[0].id, trunksId)
                .subscribe(function (resp) { return console.log(resp); });
        }
    };
    ;
    DetachTrunksComponent.prototype.aggrid_deleteTrunks = function () {
        this.event_onDel.emit('delete-trunks');
    };
    ;
    DetachTrunksComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    ;
    DetachTrunksComponent = __decorate([
        core_1.Component({
            selector: 'app-detach-trunks',
            templateUrl: './detach-trunks.component.html',
            styleUrls: ['./detach-trunks.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, rate_cards_api_service_1.RateCardsService,
            rate_cards_shared_service_1.RateCardsSharedService])
    ], DetachTrunksComponent);
    return DetachTrunksComponent;
}());
exports.DetachTrunksComponent = DetachTrunksComponent;
//# sourceMappingURL=detach-trunks.component.js.map