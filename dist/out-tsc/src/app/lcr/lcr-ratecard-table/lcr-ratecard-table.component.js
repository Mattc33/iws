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
var LcrRatecardTableComponent = /** @class */ (function () {
    function LcrRatecardTableComponent(lcrService, lcrSharedService) {
        this.lcrService = lcrService;
        this.lcrSharedService = lcrSharedService;
        this.columnDefs = this.createColumnDefs();
        this.columnDefsRates = this.createColumnDefsRates();
    }
    LcrRatecardTableComponent.prototype.ngOnInit = function () {
        this.get_allRatecards();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    LcrRatecardTableComponent.prototype.get_allRatecards = function () {
        var _this = this;
        this.lcrService.get_allRatecards()
            .subscribe(function (data) {
            _this.get_allProviders();
            _this.rowData = _this.lcrSharedService.get_rowDataWithProviderName(data, _this.providerData);
        });
    };
    LcrRatecardTableComponent.prototype.get_rates = function (ratecard_id) {
        var _this = this;
        this.lcrService.get_ratesInRatecard(ratecard_id)
            .subscribe(function (data) {
            _this.gridApiRates.setRowData(data);
            console.log(data.metadata);
        });
    };
    LcrRatecardTableComponent.prototype.get_allProviders = function () {
        var _this = this;
        this.lcrSharedService.current_providerJson.subscribe(function (data) { _this.providerData = data; });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    LcrRatecardTableComponent.prototype.on_gridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrRatecardTableComponent.prototype.on_gridReady_rates = function (params) {
        this.gridApiRates = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrRatecardTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Id', field: 'id', checkboxSelection: true, width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Provider', field: 'provider_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active', field: 'active', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
        ];
    };
    LcrRatecardTableComponent.prototype.createColumnDefsRates = function () {
        return [
            {
                headerName: 'Id', field: 'id',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination Id', field: 'destination_id',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Rate', field: 'buyrate',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Rate', field: 'sellrate',
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
    LcrRatecardTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    LcrRatecardTableComponent.prototype.selectionChanged = function (params) {
        var id = this.gridApi.getSelectedRows()[0].id;
        console.log(id);
        this.get_rates(id);
    };
    LcrRatecardTableComponent = __decorate([
        core_1.Component({
            selector: 'app-lcr-ratecard-table',
            templateUrl: './lcr-ratecard-table.component.html',
            styleUrls: ['./lcr-ratecard-table.component.scss']
        }),
        __metadata("design:paramtypes", [lcr_api_service_1.LCRService,
            lcr_shared_service_1.LCRSharedService])
    ], LcrRatecardTableComponent);
    return LcrRatecardTableComponent;
}());
exports.LcrRatecardTableComponent = LcrRatecardTableComponent;
//# sourceMappingURL=lcr-ratecard-table.component.js.map