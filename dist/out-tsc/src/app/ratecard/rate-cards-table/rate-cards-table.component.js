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
var delete_rates_component_1 = require("./dialog/delete-rates/delete-rates.component");
var delete_rate_cards_dialog_component_1 = require("./dialog/delete-rate-cards/delete-rate-cards-dialog.component");
var detach_trunks_component_1 = require("./dialog/detach-trunks/detach-trunks.component");
var nestedAgGrid_shared_service_1 = require("./../../shared/services/global/nestedAgGrid.shared.service");
var snackbar_shared_service_1 = require("./../../shared/services/global/snackbar.shared.service");
var rate_cards_api_service_1 = require("./../../shared/api-services/ratecard/rate-cards.api.service");
var rate_cards_shared_service_1 = require("./../../shared/services/ratecard/rate-cards.shared.service");
var RateCardsTableComponent = /** @class */ (function () {
    function RateCardsTableComponent(rateCardsService, rateCardsSharedService, nestedAgGridService, dialog, _snackbar) {
        this.rateCardsService = rateCardsService;
        this.rateCardsSharedService = rateCardsSharedService;
        this.nestedAgGridService = nestedAgGridService;
        this.dialog = dialog;
        this._snackbar = _snackbar;
        // Props for AG Grid
        this.rowSelectionTypeM = 'multiple';
        this.rowSelectionTypeS = 'single';
        // Props for button toggle
        this.buttonToggleBoolean = true;
        this.buttonToggleBoolean_trunks = true;
        this.quickSearchValue = '';
        this.columnDefs = this.createColumnDefs();
        this.columnDefsRates = this.createColumnDefsRates();
        this.columnDefsTrunks = this.createColumnsDefsTrunks();
    }
    RateCardsTableComponent.prototype.ngOnInit = function () {
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.get_allRatecards();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.get_allRatecards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard()
            .subscribe(function (data) {
            _this.rowData = _this.nestedAgGridService.formatDataToNestedArr(data);
        }, function (error) { return console.log(error); });
    };
    RateCardsTableComponent.prototype.set_allRatecards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard()
            .subscribe(function (data) {
            _this.gridApi.setRowData(_this.nestedAgGridService.formatDataToNestedArr(data));
        }, function (error) { return console.log(error); });
    };
    RateCardsTableComponent.prototype.put_editRateCard = function (rateCardObj, id) {
        var _this = this;
        this.rateCardsService.put_editRatecard(rateCardObj, id)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Edit Successful', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error('Edit Failed', 2000);
        });
    };
    RateCardsTableComponent.prototype.put_editRates = function (id, rateCardObj) {
        var _this = this;
        this.rateCardsService.put_EditRates(id, rateCardObj)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Edit Successful', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error('Edit Failed', 2000);
        });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsTableComponent.prototype.on_GridReady_Rates = function (params) {
        this.gridApiRates = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsTableComponent.prototype.on_GridReady_Trunks = function (params) {
        this.gridApiTrunks = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsTableComponent.prototype.createColumnDefs = function () {
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
                headerName: 'Enabled?', field: 'active', filter: 'agNumberColumnFilter', width: 100, editable: true,
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: { values: [true, false] },
            }
        ];
    };
    RateCardsTableComponent.prototype.createColumnDefsRates = function () {
        return [
            {
                headerName: 'Prefix', field: 'prefix',
                checkboxSelection: true, headerCheckboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination', field: 'destination', width: 300,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Rate', field: 'buy_rate', editable: true,
                filter: 'agNumberColumnFilter', width: 150,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Rate', field: 'sell_rate', editable: true,
                filter: 'agNumberColumnFilter', width: 150,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Difference',
                valueGetter: function (params) {
                    var diff = (params.data.sell_rate - params.data.buy_rate);
                    var percent = ((diff) / params.data.buy_rate) * 100;
                    var diffFixed = diff.toFixed(4);
                    var percentFixed = percent.toFixed(2);
                    return diffFixed + "(" + percentFixed + "%)";
                }, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Approved?', field: 'confirmed', editable: true, width: 100,
                cellEditor: 'select', cellEditorParams: { values: [true, false] },
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                }, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', width: 100,
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                }
            }
        ];
    };
    RateCardsTableComponent.prototype.createColumnsDefsTrunks = function () {
        return [
            {
                headerName: 'Trunk Id', field: 'cx_trunk_id',
                checkboxSelection: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Meta Data', field: 'metadata',
            }
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    RateCardsTableComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(this.quickSearchValue);
    };
    RateCardsTableComponent.prototype.activeFilter = function () {
        var activeFilterComponent = this.gridApi.getFilterInstance('active');
        activeFilterComponent.setModel({
            type: 'greaterThan',
            filter: 0
        });
        this.gridApi.onFilterChanged();
    };
    RateCardsTableComponent.prototype.expandAll = function (expand) {
        this.gridApi.forEachNode(function (node) {
            if (node.group) {
                node.setExpanded(expand);
            }
        });
    };
    /*
        ~~~~~ Selection ~~~~~
    */
    RateCardsTableComponent.prototype.aggrid_selectionChanged = function () {
        var _this = this;
        this.gridApiRates.setRowData([]);
        this.gridApiTrunks.setRowData([]);
        this.rowRatecardObj = this.gridApi.getSelectedRows();
        this.selectedRatecardId = this.rowRatecardObj[0].id;
        this.rateCardsService.get_ratesInRatecard(this.selectedRatecardId)
            .subscribe(function (data) {
            _this.gridApiRates.updateRowData({ add: data });
        });
        this.rateCardsService.get_specificRatecard(this.selectedRatecardId)
            .subscribe(function (data) {
            _this.gridApiTrunks.updateRowData({ add: data.trunks });
        });
    };
    RateCardsTableComponent.prototype.aggrid_rates_selectionChanged = function () {
        this.rowSelectionRates = this.gridApiRates.getSelectedRows();
        console.log(this.rowSelectionRates);
    };
    RateCardsTableComponent.prototype.aggrid_trunks_selectionChanged = function () {
        this.rowSelectionTrunks = this.gridApiTrunks.getSelectedRows();
        console.log(this.rowSelectionTrunks);
    };
    /*
        ~~~~~~~~~~ Button Toggle ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.rowSelected = function (params) {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    RateCardsTableComponent.prototype.toggleButtonStates = function () {
        if (this.gridSelectionStatus > 0) {
            this.buttonToggleBoolean = false;
        }
        else {
            this.buttonToggleBoolean = true;
        }
        return this.buttonToggleBoolean;
    };
    RateCardsTableComponent.prototype.rowSelected_trunks = function (params) {
        this.gridSelectionStatus_trunks = this.gridApiTrunks.getSelectedNodes().length;
    };
    RateCardsTableComponent.prototype.toggleButtonStates_trunks = function () {
        if (this.gridSelectionStatus_trunks > 0) {
            this.buttonToggleBoolean_trunks = false;
        }
        else {
            this.buttonToggleBoolean_trunks = true;
        }
        return this.buttonToggleBoolean_trunks;
    };
    /*
        ~~~~~ Addition ~~~~~
    */
    RateCardsTableComponent.prototype.aggrid_addRow = function (obj) {
        this.gridApi.updateRowData({ add: [obj] });
    };
    RateCardsTableComponent.prototype.aggrid_trunks_addRow = function (obj) {
        this.gridApiTrunks.updateRowData({ add: [obj] });
    };
    /*
        ~~~~~ Edit ~~~~~
    */
    RateCardsTableComponent.prototype.aggrid_onCellValueChanged = function (params) {
        var id = params.data.id;
        var rateCardObj = {
            name: params.data.name,
            carrier_id: params.data.carrier_id,
            confirmed: JSON.parse(params.data.confirmed)
        };
        this.put_editRateCard(rateCardObj, id);
    };
    RateCardsTableComponent.prototype.aggrid_onCellValueChanged_rates = function (params) {
        var id = params.data.id;
        var active;
        var confirmed;
        if (params.data.active === 1) {
            active = true;
        }
        if (params.data.active === 0) {
            active = false;
        }
        if (params.data.confirmed === 'true') {
            confirmed = true;
        }
        if (params.data.confirmed === 'false') {
            confirmed = false;
        }
        var ratesObj = {
            ratecard_id: this.selectedRatecardId,
            prefix: params.data.prefix,
            destination: params.data.destination,
            active: active,
            sell_rate: parseFloat(params.data.sell_rate),
            buy_rate: parseFloat(params.data.buy_rate),
            sell_rate_minimum: params.data.sell_rate_minimum,
            sell_rate_increment: params.data.sell_rate_increment,
            buy_rate_minimum: params.data.buy_rate_minimum,
            buy_rate_increment: params.data.buy_rate_increment,
            confirmed: confirmed
        };
        this.put_editRates(id, ratesObj);
    };
    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.openDialogDelRatecard = function () {
        var _this = this;
        this.rateCardsSharedService.changeRowAllObj(this.rowRatecardObj);
        var dialogRef = this.dialog.open(delete_rate_cards_dialog_component_1.DeleteRateCardsDialogComponent, {});
        dialogRef.afterClosed().subscribe(function () {
            _this.set_allRatecards();
        });
    };
    RateCardsTableComponent.prototype.openDialogDelRates = function () {
        this.rateCardsSharedService.changeRowRatesObj(this.rowSelectionRates);
        var dialogRef = this.dialog.open(delete_rates_component_1.DeleteRatesComponent, {});
        var sub = dialogRef.componentInstance.event_onDel.subscribe(function (data) {
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    /*
        ~~~~~ Trunks ~~~~~
    */
    RateCardsTableComponent.prototype.openDialogDetachTrunks = function () {
        this.rateCardsSharedService.changeRowAllObj(this.rowRatecardObj);
        this.rateCardsSharedService.changeRowTrunksObj(this.rowSelectionTrunks);
        var dialogRef = this.dialog.open(detach_trunks_component_1.DetachTrunksComponent, {});
        var sub = dialogRef.componentInstance.event_onDel.subscribe(function (data) {
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    RateCardsTableComponent = __decorate([
        core_1.Component({
            selector: 'app-rate-cards-table',
            templateUrl: './rate-cards-table.component.html',
            styleUrls: ['./rate-cards-table.component.scss']
        }),
        __metadata("design:paramtypes", [rate_cards_api_service_1.RateCardsService,
            rate_cards_shared_service_1.RateCardsSharedService,
            nestedAgGrid_shared_service_1.NestedAgGridService,
            material_1.MatDialog,
            snackbar_shared_service_1.SnackbarSharedService])
    ], RateCardsTableComponent);
    return RateCardsTableComponent;
}());
exports.RateCardsTableComponent = RateCardsTableComponent;
//# sourceMappingURL=rate-cards-table.component.js.map