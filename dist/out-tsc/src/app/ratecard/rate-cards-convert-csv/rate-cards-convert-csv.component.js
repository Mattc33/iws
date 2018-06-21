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
var ngx_papaparse_1 = require("ngx-papaparse");
var FileSaver_1 = require("file-saver/FileSaver");
var nestedAgGrid_shared_service_1 = require("./../../shared/services/global/nestedAgGrid.shared.service");
var rate_cards_api_service_1 = require("./../../shared/api-services/ratecard/rate-cards.api.service");
var RateCardsConvertCsvComponent = /** @class */ (function () {
    function RateCardsConvertCsvComponent(rateCardsService, nestedAgGridService, papa) {
        this.rateCardsService = rateCardsService;
        this.nestedAgGridService = nestedAgGridService;
        this.papa = papa;
        this.rowSelectionTypeM = 'multiple';
        this.arrOfRates = [];
        this.disableStep2 = true;
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefs = this.createColumnDefs();
    }
    RateCardsConvertCsvComponent.prototype.ngOnInit = function () {
        this.get_ratecards();
    };
    // ================================================================================
    // Ratecard API Service
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.get_ratecards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard().subscribe(function (data) {
            _this.rowData = _this.nestedAgGridService.formatDataToNestedArr(data);
        }, function (error) { console.log(error); });
    };
    RateCardsConvertCsvComponent.prototype.get_specificRatecard = function (ratecard_id, fileName) {
        var _this = this;
        this.rateCardsService.get_ratesInRatecard(ratecard_id)
            .subscribe(function (data) {
            var csv = _this.papaUnparse(data);
            _this.saveToFileSystem(csv, fileName);
        });
    };
    RateCardsConvertCsvComponent.prototype.get_specificRatecardOneFile = function (ratecard_id, fileName) {
        var _this = this;
        this.rateCardsService.get_ratesInRatecard(ratecard_id)
            .subscribe(function (data) {
            _this.arrOfRates.push(data);
        });
    };
    // ================================================================================
    // AG Grid Initiation
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsConvertCsvComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'RateCard Group', field: 'ratecard_bundle',
                cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,
                width: 300, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country', width: 180,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Approve?', editable: true, field: 'confirmed', width: 100,
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: { values: [true, false] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', filter: 'agNumberColumnFilter', hide: true, width: 100,
            }
        ];
    };
    // ================================================================================
    // AG Grid events
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    RateCardsConvertCsvComponent.prototype.rowSelected = function (params) {
        this.currentSelectedRows = this.gridApi.getSelectedRows();
    };
    // ================================================================================
    // CSV conversion
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.onConvertJsonToCsv = function () {
        for (var i = 0; i < this.currentSelectedRows.length; i++) {
            var eachRatecard = this.currentSelectedRows[i].id;
            var fileName = this.getSelectedFileNames(i);
            this.get_specificRatecard(eachRatecard, fileName);
        }
    };
    RateCardsConvertCsvComponent.prototype.getSelectedFileNames = function (id) {
        var ratecard_name = this.gridApi.getSelectedRows()[id].ratecard_bundle;
        var country = this.gridApi.getSelectedRows()[id].country;
        var carrier = this.gridApi.getSelectedRows()[id].carrier_name;
        var currentTime = Date.now();
        var fileName = (ratecard_name + "_" + country + "_" + carrier + "_" + currentTime).replace(/\s/g, '');
        return fileName;
    };
    RateCardsConvertCsvComponent.prototype.papaUnparse = function (json) {
        var config = {
            header: false,
        };
        var fields = ['prefix', 'destination', 'sell_rate', 'sell_rate_minimum', 'sell_rate_increment',
            'buy_rate', 'buy_rate_minimum', 'buy_rate_increment'];
        var csv = this.papa.unparse({ data: json, fields: fields }, config);
        return csv;
    };
    RateCardsConvertCsvComponent.prototype.saveToFileSystem = function (csv, filenameinput) {
        var filename = filenameinput;
        var blob = new Blob([csv], { type: 'text/plain' });
        FileSaver_1.saveAs(blob, filename);
    };
    // ================================================================================
    // CSV conversion
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.onConvertJsonToCsvOneFile = function () {
        for (var i = 0; i < this.currentSelectedRows.length; i++) {
            var eachRatecard = this.currentSelectedRows[i].id;
            var fileName = this.getSelectedFileNames(0);
            this.get_specificRatecardOneFile(eachRatecard, fileName);
        }
        // setTimeout(30000);
        this.flipButtonDisable();
    };
    RateCardsConvertCsvComponent.prototype.flipButtonDisable = function () {
        this.disableStep2 = !this.disableStep2;
    };
    RateCardsConvertCsvComponent.prototype.getSelectedFileNamesAZ = function (id) {
        var ratecard_name = this.gridApi.getSelectedRows()[id].ratecard_bundle;
        var country = this.gridApi.getSelectedRows()[id].country;
        var carrier = this.gridApi.getSelectedRows()[id].carrier_name;
        var currentTime = Date.now();
        var fileName = (ratecard_name + "_AZ_" + carrier + "_" + currentTime).replace(/\s/g, '');
        return fileName;
    };
    RateCardsConvertCsvComponent.prototype.formOneFile = function () {
        var fileName = this.getSelectedFileNamesAZ(0);
        var merged = [].concat.apply([], this.arrOfRates);
        var mergedWithCents = [];
        for (var i = 0; i < merged.length; i++) {
            mergedWithCents.push({
                prefix: merged[i].prefix,
                destination: merged[i].destination,
                sell_rate: merged[i].sell_rate * 100,
                sell_rate_minimum: merged[i].sell_rate_minimum,
                sell_rate_increment: merged[i].sell_rate_increment,
                buy_rate: merged[i].buy_rate * 100,
                buy_rate_minimum: merged[i].buy_rate_minimum,
                buy_rate_increment: merged[i].buy_rate_increment
            });
        }
        var csv = this.papaUnparse(mergedWithCents);
        this.saveToFileSystem(csv, fileName);
        this.arrOfRates = [];
        this.disableStep2 = !this.disableStep2;
    };
    RateCardsConvertCsvComponent = __decorate([
        core_1.Component({
            selector: 'app-rate-cards-convert-csv',
            templateUrl: './rate-cards-convert-csv.component.html',
            styleUrls: ['./rate-cards-convert-csv.component.scss']
        }),
        __metadata("design:paramtypes", [rate_cards_api_service_1.RateCardsService,
            nestedAgGrid_shared_service_1.NestedAgGridService,
            ngx_papaparse_1.PapaParseService])
    ], RateCardsConvertCsvComponent);
    return RateCardsConvertCsvComponent;
}());
exports.RateCardsConvertCsvComponent = RateCardsConvertCsvComponent;
//# sourceMappingURL=rate-cards-convert-csv.component.js.map