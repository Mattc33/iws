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
var nestedAgGrid_shared_service_1 = require("./../../shared/services/global/nestedAgGrid.shared.service");
var call_plan_api_service_1 = require("./../services/call-plan.api.service");
var call_plan_shared_service_1 = require("./../services/call-plan.shared.service");
var snackbar_shared_service_1 = require("./../../shared/services/global/snackbar.shared.service");
var buttonStates_shared_service_1 = require("./../../shared/services/global/buttonStates.shared.service");
var del_callplan_component_1 = require("./dialog/del-callplan/del-callplan.component");
var add_callplan_component_1 = require("./dialog/add-callplan/add-callplan.component");
var add_code_component_1 = require("./dialog/add-code/add-code.component");
var add_rate_card_component_1 = require("./dialog/add-rate-card/add-rate-card.component");
var dettach_ratecards_component_1 = require("./dialog/dettach-ratecards/dettach-ratecards.component");
var dettach_codes_component_1 = require("./dialog/dettach-codes/dettach-codes.component");
var CallPlanTableComponent = /** @class */ (function () {
    function CallPlanTableComponent(callPlanService, callPlanSharedService, nestedAgGridService, dialog, formBuilder, _snackbar, _buttonToggle) {
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.nestedAgGridService = nestedAgGridService;
        this.dialog = dialog;
        this.formBuilder = formBuilder;
        this._snackbar = _snackbar;
        this._buttonToggle = _buttonToggle;
        // Props for AG Grid
        this.defineRowSelectionType = 'multiple';
        this.defineRowSelectionTypeS = 'single';
        this.columnDefs = this.createColumnDefs();
        this.columnDefsDetail = this.createColumnDefsDetail();
        this.columnDefsDetail2 = this.createColumnDefsDetail2();
        this.columnDefsRatecards = this.createColumnDefsRatecards();
        this.columnDefsCodes = this.createColumnDefsCodes();
    }
    CallPlanTableComponent.prototype.ngOnInit = function () {
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.get_allCallPlansData();
    };
    // ================================================================================
    // API
    // ================================================================================
    CallPlanTableComponent.prototype.get_allCallPlansData = function () {
        var _this = this;
        this.callPlanService.get_allCallplan()
            .subscribe(function (data) { _this.rowData = data; }, function (error) { console.log(error); });
    };
    CallPlanTableComponent.prototype.get_specificCallPlanData = function (callPlanId) {
        var _this = this;
        this.callPlanService.get_specificCallplan(callPlanId)
            .subscribe(function (data) {
            _this.callPlanSharedService.changeCallPlanObj(data);
            _this.gridApiDetail.updateRowData({ add: [data] });
            _this.gridApiDetail2.updateRowData({ add: [data] });
            var ratecardData = _this.nestedAgGridService.formatDataToNestedArr(data.ratecards);
            _this.gridApiRatecards.setRowData(ratecardData);
            _this.gridApiCodes.setRowData(data.codes);
        });
    };
    CallPlanTableComponent.prototype.put_editCallPlan = function (callPlanObj, callplan_id) {
        var _this = this;
        this.callPlanService.put_editCallPlan(callPlanObj, callplan_id)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Edit Successful', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error("Edit Failed", 2000);
        });
    };
    CallPlanTableComponent.prototype.put_editCodes = function (callplanId, codesId, body) {
        var _this = this;
        this.callPlanService.put_editPlanCode(callplanId, codesId, body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Edit Successful', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error("Edit Failed", 2000);
        });
    };
    CallPlanTableComponent.prototype.post_callplanToLCR = function (callplan_id, body) {
        var _this = this;
        this.callPlanService.post_callplanToLCR(callplan_id, body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Callplan successfully inserted into LCR.', 3000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error("Error: Something is wrong. Check if Callplan has codes, ratecards, and trunks.", 3000);
        });
    };
    // ================================================================================
    // AG Grid Initialiation
    // ================================================================================
    CallPlanTableComponent.prototype.on_GridReady_Callplan = function (params) {
        this.gridApiCallplan = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.on_GridReady_Details = function (params) {
        this.gridApiDetail = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.on_GridReady_Details2 = function (params) {
        this.gridApiDetail2 = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.on_GridReady_Ratecards = function (params) {
        this.gridApiRatecards = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.on_GridReady_Codes = function (params) {
        this.gridApiCodes = params.api;
        this.columnApiCodes = params.ColumnApi;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Call Plans', field: 'title',
                checkboxSelection: true, editable: true,
                width: 250, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Available', field: 'available', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['available', 'unavailable', 'deleted', 'staged', 'deleted'] },
            },
        ];
    };
    CallPlanTableComponent.prototype.createColumnDefsDetail = function () {
        return [
            {
                headerName: 'Sub Title', field: 'subtitle', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Valid Through', field: 'valid_through', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Days in Plan', field: 'day_period', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Price', field: 'buy_price',
                editable: true, filter: 'agNumberColumnFilter',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Price', field: 'sell_price',
                editable: true, filter: 'agNumberColumnFilter',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
        ];
    };
    CallPlanTableComponent.prototype.createColumnDefsDetail2 = function () {
        return [
            {
                headerName: 'Plan Rank', field: 'ranking',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Activated on?', field: 'activeWhen', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['IMMEDIATELY', 'SUCCESS_CALL'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Promotion?', editable: true, field: 'isPurchasable',
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: { values: ['true', 'false'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Plan Type', field: 'planTypeName', editable: true, cellEditor: 'select',
                cellEditorParams: { values: ['UNLIMITED_CALL_PLAN', 'PAY_AS_YOU_GO_CALL_PLAN', 'MINUTES_CALL_PLAN'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Max Destination #', field: 'maxDestNumbers',
                editable: true,
            },
            {
                headerName: 'Max Minutes', field: 'maxMinutes',
                editable: true,
            }
        ];
    };
    CallPlanTableComponent.prototype.createColumnDefsRatecards = function () {
        return [
            {
                headerName: 'Ratecard Name', field: 'ratecard_bundle', checkboxSelection: true,
                headerCheckboxSelection: true, cellRenderer: 'agGroupCellRenderer', width: 400,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Offer', field: 'offer',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            }
        ];
    };
    CallPlanTableComponent.prototype.createColumnDefsCodes = function () {
        return [
            {
                headerName: 'Codes', field: 'code', checkboxSelection: true,
                headerCheckboxSelection: true, width: 300,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Origination Country', field: 'ori_cc', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination Country', field: 'des_cc', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Code', field: 'carrier_code',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Plan Type', field: 'planType', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Days in Code', field: 'day_period', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Plan Number', field: 'planNumber', editable: true,
            }
        ];
    };
    // ================================================================================
    // AG Grid UI
    // ================================================================================
    CallPlanTableComponent.prototype.onGridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.onSelectionChangedCallPlan = function () {
        this.clearTableRowData();
        this.rowSelectionCallplan = this.gridApiCallplan.getSelectedRows(); // pass global row obj to row selection global var
        this.rowIdAll = this.rowSelectionCallplan[0].id; // pass callplan row id to global var
        this.callplanTitle = this.rowSelectionCallplan[0].title; // pass call plan title to ratecard dialog
        this.get_specificCallPlanData(this.rowIdAll);
    };
    CallPlanTableComponent.prototype.clearTableRowData = function () {
        this.gridApiDetail.setRowData([]);
        this.gridApiDetail2.setRowData([]);
        this.gridApiRatecards.setRowData([]);
        this.gridApiCodes.setRowData([]);
    };
    CallPlanTableComponent.prototype.aggrid_rateCards_selectionChanged = function () {
        this.rowSelectionRatecards = this.gridApiRatecards.getSelectedRows();
    };
    CallPlanTableComponent.prototype.aggrid_codes_selectionChanged = function () {
        this.rowSelectionCodes = this.gridApiCodes.getSelectedRows();
    };
    // ================================================================================
    // Button Toggle
    // ================================================================================
    CallPlanTableComponent.prototype.toggleButtonStateCallplan = function () {
        return this._buttonToggle.toggleButtonStates(this.gridSelectionStatusCallplan);
    };
    CallPlanTableComponent.prototype.toggleButtonStateRatecard = function () {
        return this._buttonToggle.toggleButtonStates(this.gridSelectionStatusRatecard);
    };
    CallPlanTableComponent.prototype.toggleButtonStateCode = function () {
        return this._buttonToggle.toggleButtonStates(this.gridSelectionStatusCode);
    };
    CallPlanTableComponent.prototype.onRowSelectedCallplan = function () {
        this.selectedCallplanIndex = this.gridApiCallplan.getSelectedNodes()[0].rowIndex; // Get rowindex of callplan;
        this.gridSelectionStatusCallplan = this.gridApiCallplan.getSelectedNodes().length;
    };
    CallPlanTableComponent.prototype.onRowSelectedRatecard = function () {
        this.gridSelectionStatusRatecard = this.gridApiRatecards.getSelectedNodes().length;
    };
    CallPlanTableComponent.prototype.onRowSelectedCode = function () {
        this.gridSelectionStatusCode = this.gridApiCodes.getSelectedNodes().length;
    };
    // ================================================================================
    // Delete and Add Row Data AG Grid
    // @Todo
    // ================================================================================
    CallPlanTableComponent.prototype.aggrid_delRow = function (string) {
        if (string === 'del-callplan') {
            this.gridApiCallplan.updateRowData({ remove: this.rowSelectionCallplan });
        }
        if (string === 'detach-ratecards') {
            this.gridApiCallplan.deselectAll();
            this.gridApiCallplan.selectIndex(this.selectedCallplanIndex, false, false);
        }
        if (string === 'detach-codes') {
            this.gridApiCodes.updateRowData({ remove: this.rowSelectionCodes });
        }
    };
    CallPlanTableComponent.prototype.aggrid_addRow_codes = function (obj) {
        this.gridApiCallplan.deselectAll();
        this.gridApiCallplan.selectNode(this.nodeSelection);
    };
    CallPlanTableComponent.prototype.aggrid_addRow_callplans = function (obj) {
        this.gridApiCallplan.updateRowData({ add: [obj] });
    };
    CallPlanTableComponent.prototype.onCellValueChanged = function (params) {
        var id = params.data.id;
        var date = Date.parse(params.data.valid_through).toString();
        var forPromotion;
        if (params.data.isPurchasable === 1 || params.data.isPurchasable === 'true') {
            forPromotion = true;
        }
        if (params.data.isPurchasable === 0 || params.data.isPurchasable === 'false') {
            forPromotion = false;
        }
        var detailObj = {
            carrier_id: params.data.carrier_id,
            title: params.data.title,
            subtitle: params.data.subtitle,
            available: params.data.available,
            valid_through: date,
            buy_price: parseFloat(params.data.buy_price),
            sell_price: parseFloat(params.data.sell_price),
            day_period: parseInt(params.data.day_period, 0),
            planTypeName: params.data.planTypeName,
            activeWhen: params.data.activeWhen,
            ranking: parseInt(params.data.ranking, 0),
            isPurchasable: forPromotion,
            maxDestNumbers: parseInt(params.data.maxDestNumbers, 0),
            maxMinutes: parseInt(params.data.maxMinutes, 0)
        };
        this.put_editCallPlan(detailObj, id);
    };
    CallPlanTableComponent.prototype.onCellValueChanged_codes = function (params) {
        var callplanId = this.gridApiCallplan.getSelectedRows()[0].id;
        var codesId = params.data.id;
        var codesObj = {
            ori_cc: parseInt(params.data.ori_cc, 0),
            des_cc: parseInt(params.data.des_cc, 0),
            carrier_code: params.data.carrier_code,
            planType: parseInt(params.data.planType, 0),
            priority: parseInt(params.data.priority, 0),
            day_period: parseInt(params.data.day_period, 0),
            planNumber: parseInt(params.data.planNumber, 0)
        };
        this.put_editCodes(callplanId, codesId, codesObj);
    };
    CallPlanTableComponent.prototype.click_sendToLCR = function () {
        this.sendCallplanToLCR();
    };
    CallPlanTableComponent.prototype.sendCallplanToLCR = function () {
        var callplan_id = this.gridApiCallplan.getSelectedNodes()[0].data.id;
        var body = {};
        this.post_callplanToLCR(callplan_id, body);
    };
    // ================================================================================
    // Dialog Callplan
    // ================================================================================
    CallPlanTableComponent.prototype.openDialogDel = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        var dialogRef = this.dialog.open(del_callplan_component_1.DelCallPlanComponent, {});
        var sub = dialogRef.componentInstance.event_onDel
            .subscribe(function (data) {
            _this.aggrid_delRow(data);
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    CallPlanTableComponent.prototype.openDialogAddCallPlan = function () {
        var _this = this;
        var dialogRef = this.dialog.open(add_callplan_component_1.AddCallPlanComponent, {
            height: 'auto',
            width: '70vw'
        });
        var sub = dialogRef.componentInstance.event_onAdd.subscribe(function (data) {
            _this.aggrid_addRow_callplans(data);
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    // ================================================================================
    // Dialog Ratecard
    // ================================================================================
    CallPlanTableComponent.prototype.openDialogAttachRateCard = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        var dialogRef = this.dialog.open(add_rate_card_component_1.AddRateCardComponent, {
            panelClass: 'ratecard-callplan-screen-dialog',
            maxWidth: '90vw',
            autoFocus: false,
            data: this.gridApiCallplan.getSelectedRows()[0].title
        });
        dialogRef.afterClosed().subscribe(function () {
            _this.gridApiCallplan.deselectAll();
            _this.gridApiCallplan.selectIndex(_this.selectedCallplanIndex, false, false);
        });
    };
    CallPlanTableComponent.prototype.openDialogDetachRatecards = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        this.callPlanSharedService.changeRowRatecards(this.rowSelectionRatecards);
        var dialogRef = this.dialog.open(dettach_ratecards_component_1.DettachRatecardsComponent, {});
        var sub = dialogRef.componentInstance.event_onDettach
            .subscribe(function (data) {
            _this.aggrid_delRow(data);
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    // ================================================================================
    // Dialog Codes
    // ================================================================================
    CallPlanTableComponent.prototype.openDialogAttachCode = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        var dialogRef = this.dialog.open(add_code_component_1.AddCodeComponent, {
            height: 'auto',
            width: '70%',
        });
        dialogRef.afterClosed().subscribe(function () {
            _this.gridApiCallplan.deselectAll();
            _this.gridApiCallplan.selectIndex(_this.selectedCallplanIndex, false, false);
        });
    };
    CallPlanTableComponent.prototype.openDialogDetachCodes = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        this.callPlanSharedService.changeRowCodes(this.rowSelectionCodes);
        var dialogRef = this.dialog.open(dettach_codes_component_1.DettachCodesComponent, {});
        var sub = dialogRef.componentInstance.event_onDettach
            .subscribe(function (data) {
            _this.aggrid_delRow(data);
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    CallPlanTableComponent = __decorate([
        core_1.Component({
            selector: 'app-call-plan-table',
            templateUrl: './call-plan-table.component.html',
            styleUrls: ['./call-plan-table.component.scss']
        }),
        __metadata("design:paramtypes", [call_plan_api_service_1.CallPlanService,
            call_plan_shared_service_1.CallPlanSharedService,
            nestedAgGrid_shared_service_1.NestedAgGridService,
            material_1.MatDialog,
            forms_1.FormBuilder,
            snackbar_shared_service_1.SnackbarSharedService,
            buttonStates_shared_service_1.ToggleButtonStateService])
    ], CallPlanTableComponent);
    return CallPlanTableComponent;
}());
exports.CallPlanTableComponent = CallPlanTableComponent;
//# sourceMappingURL=call-plan-table.component.js.map