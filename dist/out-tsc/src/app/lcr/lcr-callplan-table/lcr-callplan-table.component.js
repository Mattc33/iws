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
var LcrCallPlanTableComponent = /** @class */ (function () {
    function LcrCallPlanTableComponent(lcrService) {
        this.lcrService = lcrService;
        this.columnDefs = this.createColumnDefs();
        this.columnDefsDetails = this.createColumnDefsReview();
        this.columnDefsDetails2 = this.createColumnDefsReview2();
    }
    LcrCallPlanTableComponent.prototype.ngOnInit = function () {
        this.get_allOffers();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    LcrCallPlanTableComponent.prototype.get_allOffers = function () {
        var _this = this;
        this.lcrService.get_allOffers()
            .subscribe(function (data) {
            _this.rowData = data;
            console.log(data);
        });
    };
    LcrCallPlanTableComponent.prototype.get_specificOffer = function (carrier_id) {
        var _this = this;
        this.lcrService.get_specificOffer(carrier_id)
            .subscribe(function (data) {
            _this.gridApiDetails.setRowData([data.metadata]);
            _this.gridApiDetails2.setRowData([data.metadata]);
            console.log(data.metadata);
        });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    LcrCallPlanTableComponent.prototype.on_gridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrCallPlanTableComponent.prototype.on_gridReady_details = function (params) {
        this.gridApiDetails = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrCallPlanTableComponent.prototype.on_gridReady_details2 = function (params) {
        this.gridApiDetails2 = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrCallPlanTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Id', field: 'id', checkboxSelection: true, width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'code', field: 'code',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Description', field: 'description',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Valid Through', field: 'valid_through',
                valueFormatter: function (params) { return new Date(params.value * 1000).toDateString(); }
            },
        ];
    };
    LcrCallPlanTableComponent.prototype.createColumnDefsReview = function () {
        return [
            {
                headerName: 'Title', field: 'title',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Subtitle', field: 'subtitle',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Type Name', field: 'typeName',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active When', field: 'activeWhen',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Price', field: 'buyPrice', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Price', field: 'sellPrice', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
        ];
    };
    LcrCallPlanTableComponent.prototype.createColumnDefsReview2 = function () {
        return [
            {
                headerName: 'Day Period', field: 'dayPeriod',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Max Dest #', field: 'maxDestNumbers',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Max Minutes', field: 'maxMinutes',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Ranking', field: 'ranking',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Purchasable?', field: 'isPurchasable',
            },
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    LcrCallPlanTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    LcrCallPlanTableComponent.prototype.selectionChanged = function (params) {
        var id = this.gridApi.getSelectedRows()[0].id;
        this.get_specificOffer(id);
    };
    LcrCallPlanTableComponent = __decorate([
        core_1.Component({
            selector: 'app-lcr-callplan-table',
            templateUrl: './lcr-callplan-table.component.html',
            styleUrls: ['./lcr-callplan-table.component.scss']
        }),
        __metadata("design:paramtypes", [lcr_api_service_1.LCRService])
    ], LcrCallPlanTableComponent);
    return LcrCallPlanTableComponent;
}());
exports.LcrCallPlanTableComponent = LcrCallPlanTableComponent;
//# sourceMappingURL=lcr-callplan-table.component.js.map