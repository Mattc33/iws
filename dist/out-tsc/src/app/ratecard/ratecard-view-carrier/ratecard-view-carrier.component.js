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
var dialog_1 = require("@angular/material/dialog");
var iso_codes_shared_service_1 = require("./../../shared/services/ratecard/iso-codes.shared.service");
var rate_cards_api_service_1 = require("./../../shared/api-services/ratecard/rate-cards.api.service");
var main_table_shared_service_1 = require("./../../shared/services/ratecard/main-table.shared.service");
var RatecardViewCarrierComponent = /** @class */ (function () {
    function RatecardViewCarrierComponent(_isoCodes, _rateCardsService, _mainTable, _elementRef, _renderer, _dialog) {
        this._isoCodes = _isoCodes;
        this._rateCardsService = _rateCardsService;
        this._mainTable = _mainTable;
        this._renderer = _renderer;
        this._dialog = _dialog;
        // gridUi
        this.rowSelectionM = 'multiple';
        this.rowSelectionS = 'single';
        this.booleanCountryCarrierSidebar = true;
        this.q = '';
        this.columnDefsCountry = this.createColumnDefsCountry();
        this.columnDefsCarrier = this.createColumnDefsCarrier();
    }
    RatecardViewCarrierComponent.prototype.ngOnInit = function () {
        this.rowDataCountry = this._isoCodes.getCountryCodes();
    };
    // ================================================================================
    // Carrier-View API Services
    // ================================================================================
    RatecardViewCarrierComponent.prototype.get_specificCarrierRatesByCountry = function (isoCode) {
        var _this = this;
        this._rateCardsService.get_ratesByCountry(isoCode)
            .subscribe(function (data) { _this.processData(data); });
    };
    RatecardViewCarrierComponent.prototype.get_specificCarrierRatesByCountryAZ = function (isoCode) {
        var _this = this;
        this._rateCardsService.get_ratesByCountry(isoCode)
            .subscribe(function (data) {
            if (data.status === 200) {
                _this.processDataAZ(data);
            }
            else {
                return;
            }
        });
    };
    RatecardViewCarrierComponent.prototype.processData = function (rowData) {
        var rowDataFiltered = [];
        for (var i = 0; i < rowData.length; i++) {
            if (rowData[i].rates.length > 0) {
                rowDataFiltered.push(rowData[i]);
            }
        }
        var carrierGroupHeadersArr = this._mainTable.createColumnGroupHeaders(rowDataFiltered);
        var columnDefsForMain = this._mainTable.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFiltered);
        this.columnDefsMain = this._mainTable.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFiltered);
        var finalRowData = this._mainTable.createRowData(rowDataFiltered);
        this.gridApiMain.setRowData(finalRowData);
        this.setCarrierRowData(carrierGroupHeadersArr);
    };
    RatecardViewCarrierComponent.prototype.processDataAZ = function (rowData) {
        var rowDataFiltered = [];
        for (var i = 0; i < rowData.length; i++) {
            if (rowData[i].rates.length > 0) {
                rowDataFiltered.push(rowData[i]);
            }
        }
        var carrierGroupHeadersArr = this._mainTable.createColumnGroupHeaders(rowDataFiltered);
        var columnDefsForMain = this._mainTable.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFiltered);
        this.columnDefsMain = this._mainTable.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFiltered);
        var finalRowData = this._mainTable.createRowData(rowDataFiltered);
        this.gridApiMain.setRowData(finalRowData);
        this.setCarrierRowData(carrierGroupHeadersArr);
        // this.gridApiCarrier.deselectAll();
        this.q += this.gridApiMain.getDataAsCsv();
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    RatecardViewCarrierComponent.prototype.on_GridReady = function (params) {
        this.gridApiMain = params.api;
        this.columnApiMain = params.columnApi;
        this.gridApiMain.setGroupHeaderHeight(50);
    };
    RatecardViewCarrierComponent.prototype.on_GridReady_country = function (params) {
        this.gridApiCountry = params.api;
        params.api.sizeColumnsToFit();
        this.gridApiCountry.selectIndex(0, true, null);
    };
    RatecardViewCarrierComponent.prototype.on_GridReady_carrier = function (params) {
        this.gridApiCarrier = params.api;
        params.api.sizeColumnsToFit();
    };
    RatecardViewCarrierComponent.prototype.createColumnDefsCountry = function () {
        return [
            {
                headerName: 'Country', field: 'country', checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                unSortIcon: true,
            },
            {
                headerName: 'Code', field: 'code', hide: true, unSortIcon: true,
            }
        ];
    };
    RatecardViewCarrierComponent.prototype.createColumnDefsCarrier = function () {
        return [
            {
                headerName: 'Carriers', field: 'ratecard_name_modified', colId: 'carrierToggle',
                checkboxSelection: true, headerCheckboxSelection: true, unSortIcon: true,
            }
        ];
    };
    RatecardViewCarrierComponent.prototype.setCarrierRowData = function (rowData) {
        this.gridApiCarrier.setRowData(rowData);
        this.gridApiCarrier.selectAll();
    };
    // ================================================================================
    // AG Grid shared Fn
    // ================================================================================
    RatecardViewCarrierComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    // ================================================================================
    // AG Grid Country Table
    // ================================================================================
    RatecardViewCarrierComponent.prototype.onSelectionChangedCountry = function (params) {
        var selectedCode = this.gridApiCountry.getSelectedRows()[0].code;
        this.gridApiMain.setRowData([]);
        this.get_specificCarrierRatesByCountry(selectedCode);
    };
    // ================================================================================
    // AG Grid Carrier Table
    // ================================================================================
    RatecardViewCarrierComponent.prototype.rowSelectedCarrier = function (params) {
        this.detectColVisibility(params.node.selected, params.data.colId);
    };
    // ================================================================================
    // Top toolbar
    // ===============================================================================
    RatecardViewCarrierComponent.prototype.toggleCountryCarrierSidebar = function () {
        this.booleanCountryCarrierSidebar = !this.booleanCountryCarrierSidebar;
    };
    // ================================================================================
    // AG Grid Main Table - Header - Assigning Events
    // ================================================================================
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Header - Hide
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RatecardViewCarrierComponent.prototype.deselectCarrierTableCheckbox = function (event, id) {
        var rowNode = this.gridApiCarrier.getRowNode(id);
        rowNode.setSelected(false);
    };
    RatecardViewCarrierComponent.prototype.detectColVisibility = function (condition, colId) {
        if (condition === true) {
            this.showCol("carrier_rate_" + colId);
            this.showCol("carrier_dest_" + colId);
        }
        if (condition === false) {
            this.hideCol("carrier_rate_" + colId);
            this.hideCol("carrier_dest_" + colId);
        }
    };
    RatecardViewCarrierComponent.prototype.hideCol = function (colId) {
        this.columnApiMain.setColumnVisible(colId, false);
    };
    RatecardViewCarrierComponent.prototype.showCol = function (colId) {
        this.columnApiMain.setColumnVisible(colId, true);
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Export
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RatecardViewCarrierComponent.prototype.exportAsCsv = function () {
        this.gridApiMain.exportDataAsCsv();
    };
    RatecardViewCarrierComponent.prototype.exportAsAZCsv = function () {
        var gridApiCountry = this.gridApiCountry;
        var gridApiCarrier = this.gridApiCarrier;
        var gridApiMain = this.gridApiMain;
        var countryLen = this.rowDataCountry.length;
        // gridApiCountry.forEachNode( (node) => {
        //     this.get_specificCarrierRatesByCountryAZ(node.data.code);
        // });
        for (var i = 0; i < 169; i++) {
            this.get_specificCarrierRatesByCountryAZ(this.rowDataCountry[i].code);
        }
    };
    RatecardViewCarrierComponent.prototype.test = function () {
        for (var i = 170; i < 240; i++) {
            this.get_specificCarrierRatesByCountryAZ(this.rowDataCountry[i].code);
        }
    };
    RatecardViewCarrierComponent.prototype.test2 = function () {
        console.log(this.q);
    };
    RatecardViewCarrierComponent = __decorate([
        core_1.Component({
            selector: 'app-ratecard-view-carrier',
            templateUrl: './ratecard-view-carrier.component.html',
            styleUrls: ['./ratecard-view-carrier.component.scss']
        }),
        __param(3, core_1.Inject(core_1.ElementRef)),
        __metadata("design:paramtypes", [iso_codes_shared_service_1.IsoCodesSharedService,
            rate_cards_api_service_1.RateCardsService,
            main_table_shared_service_1.MainTableSharedService,
            core_1.ElementRef,
            core_1.Renderer,
            dialog_1.MatDialog])
    ], RatecardViewCarrierComponent);
    return RatecardViewCarrierComponent;
}());
exports.RatecardViewCarrierComponent = RatecardViewCarrierComponent;
//# sourceMappingURL=ratecard-view-carrier.component.js.map