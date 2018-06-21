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
var del_carrier_dialog_component_1 = require("../carrier-table/dialog/del-carrier/del-carrier-dialog.component");
var add_carrier_dialog_component_1 = require("../carrier-table/dialog/add-carrier/add-carrier-dialog.component");
var carrier_api_service_1 = require("./../../shared/api-services/carrier/carrier.api.service");
var carrier_shared_service_1 = require("./../../shared/services/carrier/carrier.shared.service");
var snackbar_shared_service_1 = require("./../../shared/services/global/snackbar.shared.service");
var buttonStates_shared_service_1 = require("./../../shared/services/global/buttonStates.shared.service");
var CarrierTableComponent = /** @class */ (function () {
    function CarrierTableComponent(// inject your service
    carrierService, carrierSharedService, dialog, snackbarSharedService, toggleButtonStateService) {
        this.carrierService = carrierService;
        this.carrierSharedService = carrierSharedService;
        this.dialog = dialog;
        this.snackbarSharedService = snackbarSharedService;
        this.toggleButtonStateService = toggleButtonStateService;
        this.quickSearchValue = '';
        this.rowSelection = 'single';
        this.columnDefs = this.createColumnDefs();
    }
    CarrierTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_carrierRowData();
        this.carrierSharedService.currentRowObj.subscribe(function (giveRowObj) { return _this.rowObj = giveRowObj; });
    };
    // ================================================================================
    // Carrier API Service
    // ================================================================================
    CarrierTableComponent.prototype.get_carrierRowData = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) { return _this.rowData = data; }, function (error) { return console.log(error); });
    };
    CarrierTableComponent.prototype.put_editCarrier = function (carrierObj, id) {
        var _this = this;
        this.carrierService.put_EditCarrier(carrierObj, id)
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
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    CarrierTableComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    CarrierTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Name', field: 'name',
                editable: true, checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Phone Number', field: 'phone',
                editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Email', field: 'email',
                editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Address', field: 'address',
                width: 400, editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Taxable', field: 'taxable', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['true', 'false'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Tier Number', field: 'tier', editable: true,
                cellEditor: 'select', cellEditorParams: { values: [1, 2, 3, 4, 5] },
                filter: 'agNumberColumnFilter',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Code', field: 'code',
                editable: true,
            },
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
    CarrierTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    CarrierTableComponent.prototype.selectionChanged = function () {
        var selectedRows = this.gridApi.getSelectedRows();
        this.rowObj = selectedRows;
    };
    // ================================================================================
    // AG Grid Events
    // ================================================================================
    CarrierTableComponent.prototype.rowSelected = function () {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    CarrierTableComponent.prototype.toggleButtonStates = function () {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    };
    CarrierTableComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(this.quickSearchValue);
    };
    // ================================================================================
    // API Interactions
    // ================================================================================
    CarrierTableComponent.prototype.onRefreshRowData = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) {
            _this.gridApi.setRowData(data);
        });
    };
    CarrierTableComponent.prototype.onCellValueChanged = function (params) {
        var id = params.data.id;
        var taxable = params.data.taxable;
        if (taxable === 'false') {
            taxable = false;
        }
        else {
            taxable = true;
        }
        var carrierObj = {
            code: params.data.code,
            name: params.data.name,
            email: params.data.email,
            phone: params.data.phone,
            address: params.data.address,
            taxable: taxable,
            tier: parseInt(params.data.tier, 0)
        };
        this.put_editCarrier(carrierObj, id);
    };
    // ================================================================================
    // Carrier Dialog
    // ================================================================================
    CarrierTableComponent.prototype.openDialogAdd = function () {
        var _this = this;
        var dialogRef = this.dialog.open(add_carrier_dialog_component_1.AddCarrierDialogComponent, {
            width: '40%',
        });
        dialogRef.afterClosed().subscribe(function () {
            _this.onRefreshRowData();
        });
    };
    CarrierTableComponent.prototype.openDialogDel = function () {
        var _this = this;
        this.carrierSharedService.changeRowObj(this.rowObj);
        var dialogRef = this.dialog.open(del_carrier_dialog_component_1.DelCarrierDialogComponent, {});
        dialogRef.afterClosed().subscribe(function () {
            _this.onRefreshRowData();
        });
    };
    CarrierTableComponent = __decorate([
        core_1.Component({
            selector: 'app-carrier-table',
            templateUrl: './carrier-table.component.html',
            styleUrls: ['./carrier-table.component.scss']
        }),
        __metadata("design:paramtypes", [carrier_api_service_1.CarrierService,
            carrier_shared_service_1.CarrierSharedService,
            material_1.MatDialog,
            snackbar_shared_service_1.SnackbarSharedService,
            buttonStates_shared_service_1.ToggleButtonStateService])
    ], CarrierTableComponent);
    return CarrierTableComponent;
}());
exports.CarrierTableComponent = CarrierTableComponent;
//# sourceMappingURL=carrier-table.component.js.map