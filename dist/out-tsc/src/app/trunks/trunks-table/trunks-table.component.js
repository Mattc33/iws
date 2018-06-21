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
var forms_1 = require("@angular/forms");
var delete_trunks_component_1 = require("./dialog/delete-trunks/delete-trunks.component");
var add_trunks_component_1 = require("./dialog/add-trunks/add-trunks.component");
var trunks_api_service_1 = require("../services/trunks.api.service");
var trunks_shared_service_1 = require("./../services/trunks.shared.service");
var buttonStates_shared_service_1 = require("./../../shared/services/global/buttonStates.shared.service");
var snackbar_shared_service_1 = require("./../../shared/services/global/snackbar.shared.service");
var TrunksTableComponent = /** @class */ (function () {
    function TrunksTableComponent(dialog, formBuilder, trunksService, trunksSharedService, toggleButtonStateService, snackbarSharedService) {
        this.dialog = dialog;
        this.formBuilder = formBuilder;
        this.trunksService = trunksService;
        this.trunksSharedService = trunksSharedService;
        this.toggleButtonStateService = toggleButtonStateService;
        this.snackbarSharedService = snackbarSharedService;
        this.rowSelection = 'multiple';
        this.quickSearchValue = '';
        // Props for button toggle
        this.buttonToggleBoolean = true;
        this.columnDefs = this.createColumnDefs();
    }
    TrunksTableComponent.prototype.ngOnInit = function () {
        this.get_TrunkData();
    };
    // ================================================================================
    // Trunk API Service
    // ================================================================================
    TrunksTableComponent.prototype.get_TrunkData = function () {
        var _this = this;
        this.trunksService.get_allTrunks()
            .subscribe(function (data) { _this.rowData = data; }, function (error) { console.log(error); });
    };
    TrunksTableComponent.prototype.set_TrunkData = function () {
        var _this = this;
        this.trunksService.get_allTrunks()
            .subscribe(function (data) { _this.gridApi.setRowData(data); }, function (error) { console.log(error); });
    };
    TrunksTableComponent.prototype.put_editTrunks = function (trunkId, body) {
        var _this = this;
        this.trunksService.put_editTrunk(trunkId, body)
            .subscribe(function (resp) {
            console.log(resp);
            _this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
        });
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    TrunksTableComponent.prototype.onGridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    TrunksTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Trunk Name', field: 'trunk_name',
                editable: true, checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Transport Method', field: 'transport', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['udp', 'tcp', 'both'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Direction', field: 'direction', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['inbound', 'outbound'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Prefix', field: 'prefix',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active?', field: 'active', editable: true,
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
                headerName: 'Metadata', field: 'metadata',
                editable: true,
            }
        ];
    };
    // ================================================================================
    // AG Grid UI
    // ================================================================================
    TrunksTableComponent.prototype.onGridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    TrunksTableComponent.prototype.onSelectionChanged = function () {
        this.rowObj = this.gridApi.getSelectedRows();
    };
    TrunksTableComponent.prototype.aggrid_onCellValueChanged = function (params) {
        var id = params.data.id;
        var active;
        if (params.data.active === 1 || params.data.active === 'true') {
            active = true;
        }
        if (params.data.active === 0 || params.data.active === 'false') {
            active = false;
        }
        var trunkObj = {
            carrier_id: params.data.carrier_id,
            trunk_name: params.data.trunk_name,
            trunk_ip: params.data.trunk_ip,
            trunk_port: parseInt(params.data.trunk_port, 0),
            transport: params.data.transport,
            direction: params.data.direction,
            prefix: params.data.prefix,
            active: active,
            metadata: params.data.metadata
        };
        this.put_editTrunks(id, trunkObj);
    };
    TrunksTableComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(this.quickSearchValue);
    };
    // ================================================================================
    // Button Toggle
    // ================================================================================
    TrunksTableComponent.prototype.rowSelected = function (params) {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    TrunksTableComponent.prototype.toggleButtonStates = function () {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    };
    // ================================================================================
    // Dialog
    // ================================================================================
    TrunksTableComponent.prototype.openDialogDel = function () {
        var _this = this;
        this.trunksSharedService.changeRowObj(this.rowObj);
        var dialogRef = this.dialog.open(delete_trunks_component_1.DeleteTrunksComponent, {});
        dialogRef.afterClosed().subscribe(function () {
            _this.set_TrunkData();
        });
    };
    TrunksTableComponent.prototype.openDialogAddTrunks = function () {
        var dialogRef = this.dialog.open(add_trunks_component_1.AddTrunksComponent, {
            height: 'auto',
            width: '50%',
        });
        dialogRef.afterClosed().subscribe(function () {
        });
    };
    TrunksTableComponent = __decorate([
        core_1.Component({
            selector: 'app-trunks-table',
            templateUrl: './trunks-table.component.html',
            styleUrls: ['./trunks-table.component.scss']
        }),
        __metadata("design:paramtypes", [material_1.MatDialog,
            forms_1.FormBuilder,
            trunks_api_service_1.TrunksService,
            trunks_shared_service_1.TrunksSharedService,
            buttonStates_shared_service_1.ToggleButtonStateService,
            snackbar_shared_service_1.SnackbarSharedService])
    ], TrunksTableComponent);
    return TrunksTableComponent;
}());
exports.TrunksTableComponent = TrunksTableComponent;
//# sourceMappingURL=trunks-table.component.js.map