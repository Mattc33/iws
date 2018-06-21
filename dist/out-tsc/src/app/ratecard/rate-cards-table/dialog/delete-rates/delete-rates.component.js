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
var DeleteRatesComponent = /** @class */ (function () {
    function DeleteRatesComponent(dialogRef, data, rateCardsService, rateCardsSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.rateCardsService = rateCardsService;
        this.rateCardsSharedService = rateCardsSharedService;
        this.event_onDel = new core_1.EventEmitter;
    }
    DeleteRatesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rateCardsSharedService.currentRowRatesObj
            .subscribe(function (data) { return _this.rowRatesObj = data; });
    };
    DeleteRatesComponent.prototype.click_deleteRates = function () {
        // this.del_delRates();
        this.aggrid_deleteRates();
        this.closeDialog();
    };
    // del_delRates() {
    //     let rowRatesId: number;
    //     for( let i = 0; i<this.rowRatesObj.length; i++ ) {
    //         rowRatesId = this.rowRatesObj[i].id;
    //         this.ratesService.del_Rates(rowRatesId)
    //             .subscribe(resp => console.log(resp))
    //     }
    // };
    DeleteRatesComponent.prototype.aggrid_deleteRates = function () {
        this.event_onDel.emit('delete-rates');
    };
    DeleteRatesComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DeleteRatesComponent = __decorate([
        core_1.Component({
            selector: 'app-delete-rates',
            templateUrl: './delete-rates.component.html',
            styleUrls: ['./delete-rates.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, rate_cards_api_service_1.RateCardsService,
            rate_cards_shared_service_1.RateCardsSharedService])
    ], DeleteRatesComponent);
    return DeleteRatesComponent;
}());
exports.DeleteRatesComponent = DeleteRatesComponent;
//# sourceMappingURL=delete-rates.component.js.map