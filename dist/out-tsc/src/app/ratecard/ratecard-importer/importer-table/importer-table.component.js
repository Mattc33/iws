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
var material_1 = require("@angular/material");
var importer_api_service_1 = require("./../services/importer.api.service");
var importer_shared_service_1 = require("./../services/importer.shared.service");
var rate_cards_api_service_1 = require("./../../../shared/api-services/ratecard/rate-cards.api.service");
var snackbar_shared_service_1 = require("./../../../shared/services/global/snackbar.shared.service");
var upload_rates_dialog_component_1 = require("./dialog/upload-rates/upload-rates-dialog.component");
var ImporterTableComponent = /** @class */ (function () {
    function ImporterTableComponent(importerService, importerSharedService, dialog, rateCardsService, snackbarSharedService) {
        this.importerService = importerService;
        this.importerSharedService = importerSharedService;
        this.dialog = dialog;
        this.rateCardsService = rateCardsService;
        this.snackbarSharedService = snackbarSharedService;
        this.quickSearchValue = '';
        this.totalRatesProcessed = 0;
        this.totalRatesFromCSV = 0;
        this.columnDefs = this.createColumnDefs();
    }
    ImporterTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getNodeChildDetails = this.setGroups();
        this.importerSharedService.currentPostTableObj.subscribe(function (data) {
            _this.totalRatesProcessed = 0;
            _this.rowData = data;
            for (var i = 0; i < _this.rowData.length; i++) {
                _this.totalRatesProcessed += _this.rowData[i].rates.length;
            }
        });
        this.importerSharedService.currentRatesCSVAmount.subscribe(function (data) {
            _this.totalRatesFromCSV = 0;
            _this.totalRatesFromCSV = data;
        });
    };
    /*
        ~~~~~~~~~~ Importer API services ~~~~~~~~~~
    */
    ImporterTableComponent.prototype.put_EditRates = function (id, ratecardObj) {
        var _this = this;
        this.importerService.put_EditRates(id, ratecardObj)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
        });
    };
    ImporterTableComponent.prototype.post_attachTrunkToRatecard = function (ratecardId, trunkId) {
        var _this = this;
        this.rateCardsService.post_AttachTrunk(ratecardId, trunkId)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Trunk successfully attached.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Trunk failed to attach.', 2000);
        });
    };
    ImporterTableComponent.prototype.put_editTeleuDbRates = function (teleu_db_rate_id, body) {
        var _this = this;
        this.rateCardsService.put_EditTeleuDbRates(teleu_db_rate_id, body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
        });
    };
    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    ImporterTableComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    ImporterTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Ratecard Name', field: 'ratecard_name',
                cellRenderer: 'agGroupCellRenderer', width: 350,
                valueFormatter: function (params) {
                    var ratecard_name = params.data.ratecard_name;
                    if (ratecard_name) {
                        var country = ratecard_name.split('#');
                        return country[0] + ' - ' + country[2];
                    }
                    else {
                        return ratecard_name;
                    }
                },
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Prefix', field: 'prefix', width: 150,
                // checkboxSelection: true, headerCheckboxSelection: true,
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Tele-U(Data Base)',
                marryChildren: true,
                children: [
                    {
                        headerName: 'Buy Rate', field: 'teleu_db_buy_rate', width: 140,
                        editable: true, columnGroupShow: 'closed',
                        cellClassRules: {
                            'teleu_db-buyrate-highlight': function (params) {
                                return params.value < params.data.teleu_buy_rate;
                            }
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Sell Rate', field: 'teleu_db_sell_rate', width: 140,
                        editable: true, columnGroupShow: 'closed',
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Difference', width: 170,
                        valueGetter: function (params) {
                            if (params.data.teleu_db_buy_rate > 0) {
                                var diff = (params.data.teleu_db_sell_rate - params.data.teleu_db_buy_rate);
                                var percent = ((diff) / params.data.teleu_db_buy_rate) * 100;
                                var diffFixed = diff.toFixed(4);
                                var percentFixed = percent.toFixed(2);
                                return diffFixed + "(" + percentFixed + "%)";
                            }
                            else {
                                return '';
                            }
                        }, columnGroupShow: 'closed',
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Fixed', field: 'fixed', width: 120, editable: true,
                        cellEditor: 'select', cellEditorParams: { values: ['true', 'false'] },
                        columnGroupShow: 'closed',
                        cellStyle: { 'border-right': '2px solid #E0E0E0' },
                    }
                ]
            },
            {
                headerName: 'Tele-U(From Ratecard)',
                marryChildren: true,
                children: [
                    {
                        headerName: 'Buy Rate', field: 'teleu_buy_rate', width: 140,
                        editable: true, volatile: true, columnGroupShow: 'closed',
                        cellClassRules: {
                            'teleu-buyrate-highlight': function (params) {
                                return params.value > params.data.teleu_db_buy_rate;
                            }
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Sell Rate', field: 'teleu_sell_rate', width: 140,
                        editable: true, columnGroupShow: 'closed',
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Difference', width: 170, columnGroupShow: 'closed',
                        valueGetter: function (params) {
                            if (params.data.teleu_buy_rate > 0) {
                                var diff = (params.data.teleu_sell_rate - params.data.teleu_buy_rate);
                                var percent = ((diff) / params.data.teleu_buy_rate) * 100;
                                var diffFixed = diff.toFixed(4);
                                var percentFixed = percent.toFixed(2);
                                return diffFixed + "(" + percentFixed + "%)";
                            }
                            else {
                                return '';
                            }
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Confirmed?', field: 'teleu_confirmed', width: 120, editable: true,
                        cellEditor: 'select', cellEditorParams: { values: ['true', 'false'] },
                        cellStyle: {
                            'border-right': '2px solid #E0E0E0'
                        }, columnGroupShow: 'closed',
                    }
                ]
            },
            {
                headerName: 'Private Offer',
                marryChildren: true,
                children: [
                    {
                        headerName: 'Buy Rate', field: 'private_buy_rate', width: 160,
                        editable: true,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Sell Rate', field: 'private_sell_rate', width: 140,
                        editable: true,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Difference', width: 170,
                        valueGetter: function (params) {
                            if (params.data.private_buy_rate > 0) {
                                var diff = (params.data.private_sell_rate - params.data.private_buy_rate);
                                var percent = ((diff) / params.data.private_buy_rate) * 100;
                                var diffFixed = diff.toFixed(4);
                                var percentFixed = percent.toFixed(2);
                                return diffFixed + "(" + percentFixed + "%)";
                            }
                            else {
                                return '';
                            }
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Confirmed?', field: 'private_confirmed', width: 120, editable: true,
                        cellEditor: 'select', cellEditorParams: { values: ['true', 'false'] },
                    }
                ]
            }
        ];
    };
    ImporterTableComponent.prototype.setGroups = function () {
        return function getNodeChildDetails(rowItem) {
            if (rowItem.rates) {
                return {
                    group: true,
                    children: rowItem.rates,
                    key: rowItem.ratecard_name
                };
            }
            else {
                return null;
            }
        };
    };
    /*
        ~~~~~~~~~~ Grid UI  ~~~~~~~~~~
    */
    ImporterTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    ImporterTableComponent.prototype.expandAll = function (expand) {
        this.gridApi.forEachNode(function (node) {
            if (node.group) {
                node.setExpanded(expand);
            }
        });
    };
    /*
        ~~~~~~~~~~ Grid CRUD  ~~~~~~~~~~
    */
    ImporterTableComponent.prototype.onCellValueChanged = function (params) {
        var teleu_rate_id = params.data.teleu_rate_id;
        var private_rate_id = params.data.private_rate_id;
        var teleu_db_rate_id = params.data.teleu_db_rate_id;
        var body_TeleU = {
            buy_rate: parseFloat(params.data.teleu_buy_rate),
            sell_rate: parseFloat(params.data.teleu_sell_rate)
        };
        var body_Private = {
            buy_rate: parseFloat(params.data.private_buy_rate),
            sell_rate: parseFloat(params.data.private_sell_rate)
        };
        var body_TeleU_DB = {
            buy_rate: parseFloat(params.data.teleu_db_buy_rate),
            sell_rate: parseFloat(params.data.teleu_db_sell_rate),
            isFixed: JSON.parse(params.data.fixed)
        };
        if (params.data.teleu_buy_rate) {
            this.put_EditRates(teleu_rate_id, body_TeleU);
        }
        if (params.data.private_buy_rate) {
            this.put_EditRates(private_rate_id, body_Private);
        }
        if (params.data.teleu_db_buy_rate) {
            this.put_editTeleuDbRates(teleu_db_rate_id, body_TeleU_DB);
        }
        params.api.redrawRows(); // reset view for css changes on edit
    };
    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    ImporterTableComponent.prototype.openDialogUpload = function () {
        var _this = this;
        var dialogRef = this.dialog.open(upload_rates_dialog_component_1.UploadRatesDialogComponent, {
            width: '80vw'
        });
        var sub = dialogRef.componentInstance.event_passTrunkId.subscribe(function (data) {
            var ratecardIdArr = [];
            var trunkId = data;
            _this.gridApi.forEachNode(function (rowNode) {
                if (rowNode.data['ratecard_id (Private)']) {
                    ratecardIdArr.push(rowNode.data['ratecard_id (Private)']);
                }
                if (rowNode.data['ratecard_id (TeleU)']) {
                    ratecardIdArr.push(rowNode.data['ratecard_id (TeleU)']);
                }
            });
            for (var i = 0; i < ratecardIdArr.length; i++) {
                _this.post_attachTrunkToRatecard(ratecardIdArr[i], trunkId);
            }
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    ImporterTableComponent = __decorate([
        core_1.Component({
            selector: 'app-importer-table',
            templateUrl: './importer-table.component.html',
            styleUrls: ['./importer-table.component.scss']
        }),
        __metadata("design:paramtypes", [importer_api_service_1.ImporterService,
            importer_shared_service_1.ImporterSharedService,
            material_1.MatDialog,
            rate_cards_api_service_1.RateCardsService,
            snackbar_shared_service_1.SnackbarSharedService])
    ], ImporterTableComponent);
    return ImporterTableComponent;
}());
exports.ImporterTableComponent = ImporterTableComponent;
//# sourceMappingURL=importer-table.component.js.map