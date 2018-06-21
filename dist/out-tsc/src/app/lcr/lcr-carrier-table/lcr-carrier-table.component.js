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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var lcr_api_service_1 = require("./../services/lcr.api.service");
var lcr_shared_service_1 = require("./../services/lcr.shared.service");
var LcrCarrierTableComponent = /** @class */ (function () {
    function LcrCarrierTableComponent(lcrService, lcrSharedService) {
        this.lcrService = lcrService;
        this.lcrSharedService = lcrSharedService;
        this.columnDefs = this.createColumnDefs();
    }
    LcrCarrierTableComponent.prototype.ngOnInit = function () {
        this.get_allCarriers();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    LcrCarrierTableComponent.prototype.get_allCarriers = function () {
        var _this = this;
        this.lcrService.get_allCarriers()
            .subscribe(function (data) {
            _this.rowData = data;
            _this.lcrSharedService.change_providerJson(data);
        });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    LcrCarrierTableComponent.prototype.on_gridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrCarrierTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Id', field: 'id', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Rates Email', field: 'alerts_email',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active?', field: 'active',
            },
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    LcrCarrierTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    LcrCarrierTableComponent = __decorate([
        core_1.Component({
            selector: 'app-lcr-carrier-table',
            templateUrl: './lcr-carrier-table.component.html',
            styleUrls: ['./lcr-carrier-table.component.scss']
        }),
        __metadata("design:paramtypes", [lcr_api_service_1.LCRService,
            lcr_shared_service_1.LCRSharedService])
    ], LcrCarrierTableComponent);
    return LcrCarrierTableComponent;
}());
exports.LcrCarrierTableComponent = LcrCarrierTableComponent;
//# sourceMappingURL=lcr-carrier-table.component.js.map