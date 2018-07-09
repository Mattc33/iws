import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GridApi } from 'ag-grid';

import { NestedAgGridService } from '../../../shared/services/global/nestedAgGrid.shared.service';
import { CallPlanService } from '../../../shared/api-services/callplan/call-plan.api.service';
import { CallPlanSharedService } from '../../../shared/services/callplan/call-plan.shared.service';
import { SnackbarSharedService } from '../../../shared/services/global/snackbar.shared.service';
import { ToggleButtonStateService } from '../../../shared/services/global/buttonStates.shared.service';

import { DelCallPlanComponent } from './dialog/del-callplan/del-callplan.component';
import { AddCallPlanComponent } from './dialog/add-callplan/add-callplan.component';
import { AddCodeComponent } from './dialog/add-code/add-code.component';
import { AddRateCardComponent } from './dialog/add-rate-card/add-rate-card.component';
import { DettachRatecardsComponent } from './dialog/dettach-ratecards/dettach-ratecards.component';
import { DettachCodesComponent } from './dialog/dettach-codes/dettach-codes.component';

@Component({
  selector: 'app-call-plan-table',
  templateUrl: './call-plan-table.component.html',
  styleUrls: ['./call-plan-table.component.scss']
})
export class CallPlanTableComponent implements OnInit {

    // AG grid row/col
    rowData; columnDefs;
    columnDefsDetail; columnDefsDetail2;
    columnDefsRatecards; getNodeChildDetails;
    columnDefsCodes;

    // AG grid controllers
    gridApiCallplan: GridApi; // All
    gridApiDetail: GridApi;
    gridApiDetail2: GridApi;
    gridApiRatecards: GridApi;
    gridApiCodes: GridApi;
    columnApiCodes: GridApi;

    // Props for AG Grid
    defineRowSelectionType = 'multiple';
    defineRowSelectionTypeS = 'single';
    rowSelectionCallplan;
    rowSelectionRatecards;
    rowSelectionCodes;

    // Props for button Toggle
    gridSelectionStatusCallplan: number;
    gridSelectionStatusRatecard: number;
    gridSelectionStatusCode: number;

    // Props for internal service
    callPlanRowObj;
    rowIdAll: number;
    callplanTitle: string;
    selectedCallplanIndex;
    nodeSelection;

    constructor(
        private callPlanService: CallPlanService,
        private callPlanSharedService: CallPlanSharedService,
        private nestedAgGridService: NestedAgGridService,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private _snackbar: SnackbarSharedService,
        private _buttonToggle: ToggleButtonStateService
    ) {
        this.columnDefs = this.createColumnDefs();
        this.columnDefsDetail = this.createColumnDefsDetail();
        this.columnDefsDetail2 = this.createColumnDefsDetail2();
        this.columnDefsRatecards = this.createColumnDefsRatecards();
        this.columnDefsCodes = this.createColumnDefsCodes();
    }

    ngOnInit() {
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.get_allCallPlansData();
    }

    // ================================================================================
    // API
    // ================================================================================
    get_allCallPlansData(): void {
        this.callPlanService.get_allCallplan()
            .subscribe(
                data => { this.rowData = data; },
                error => { console.log(error); }
            );
    }

    get_specificCallPlanData(callPlanId: number) {
        this.callPlanService.get_specificCallplan(callPlanId)
            .subscribe(
                data => {
                    this.callPlanSharedService.changeCallPlanObj(data);
                    this.gridApiDetail.updateRowData({ add: [data] });
                    this.gridApiDetail2.updateRowData({ add: [data] });

                    const ratecardData = this.nestedAgGridService.formatDataToNestedArr(data.ratecards);
                    this.gridApiRatecards.setRowData( ratecardData );

                    this.gridApiCodes.setRowData( data.codes );
                },
            );
    }

    put_editCallPlan(callPlanObj, callplan_id): void {
        this.callPlanService.put_editCallPlan(callPlanObj, callplan_id)
            .subscribe(
                resp => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbar.snackbar_success('Edit Successful', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this._snackbar.snackbar_error(
                        `Edit Failed`, 2000);
                }
            );
    }

    put_editCodes(callplanId: number, codesId: number, body): void {
        this.callPlanService.put_editPlanCode(callplanId, codesId, body)
            .subscribe(
                resp => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbar.snackbar_success('Edit Successful', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this._snackbar.snackbar_error(
                        `Edit Failed`, 2000);
                }
            );
    }

    post_callplanToLCR(callplan_id: number, body: any): void {
        this.callPlanService.post_callplanToLCR(callplan_id, body)
            .subscribe(
                resp => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbar.snackbar_success('Callplan successfully inserted into LCR.', 3000);
                    }
                },
                error => {
                    console.log(error);
                    this._snackbar.snackbar_error(
                        `Error: Something is wrong. Check if Callplan has codes, ratecards, and trunks.`, 3000);
                }
            );
    }

    // ================================================================================
    // AG Grid Initialiation
    // ================================================================================
    on_GridReady_Callplan(params): void { // init grid for all call plans table
        this.gridApiCallplan = params.api;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_Details(params): void { // init grid for details table
        this.gridApiDetail = params.api;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_Details2(params): void { // init grid for details table2
        this.gridApiDetail2 = params.api;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_Ratecards(params): void { // init grid for ratecards table
        this.gridApiRatecards = params.api;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_Codes(params): void { // init grid for codes table
        this.gridApiCodes = params.api;
        this.columnApiCodes = params.ColumnApi;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs(): object { // All Call plans columns
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
                cellEditor: 'select', cellEditorParams: {values: ['available', 'unavailable', 'deleted', 'staged', 'deleted']},
            },
        ];
    }

    private createColumnDefsDetail(): object { // Detailed Call plan table
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
    }

    private createColumnDefsDetail2(): object {
        return [
            {
                headerName: 'Plan Rank', field: 'ranking',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Activated on?', field: 'activeWhen', editable: true,
                cellEditor: 'select', cellEditorParams: {values: ['IMMEDIATELY', 'SUCCESS_CALL']},
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Promotion?', editable: true, field: 'isPurchasable',
                valueFormatter: params => {
                    if (params.value === 1) { return true; }
                    if (params.value === 0) { return false; }
                },
                cellEditor: 'select', cellEditorParams: {values: ['true', 'false']},
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Plan Type', field: 'planTypeName', editable: true, cellEditor: 'select',
                cellEditorParams: {values: ['UNLIMITED_CALL_PLAN', 'PAY_AS_YOU_GO_CALL_PLAN', 'MINUTES_CALL_PLAN']},
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
    }

    private createColumnDefsRatecards(): object {
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
    }

    private createColumnDefsCodes(): object {
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
    }

    // ================================================================================
    // AG Grid UI
    // ================================================================================
    onGridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

    onSelectionChangedCallPlan(): void {
        this.clearTableRowData();

        this.rowSelectionCallplan = this.gridApiCallplan.getSelectedRows(); // pass global row obj to row selection global var
        this.rowIdAll = this.rowSelectionCallplan[0].id; // pass callplan row id to global var
        this.callplanTitle = this.rowSelectionCallplan[0].title; // pass call plan title to ratecard dialog

        this.get_specificCallPlanData(this.rowIdAll);
    }

    clearTableRowData(): void {
        this.gridApiDetail.setRowData([]);
        this.gridApiDetail2.setRowData([]);
        this.gridApiRatecards.setRowData([]);
        this.gridApiCodes.setRowData([]);
    }

    aggrid_rateCards_selectionChanged(): void { // Selection event for ratecards table
        this.rowSelectionRatecards = this.gridApiRatecards.getSelectedRows();
    }

    aggrid_codes_selectionChanged(): void {
        this.rowSelectionCodes = this.gridApiCodes.getSelectedRows();
    }

    // ================================================================================
    // Button Toggle
    // ================================================================================
    toggleButtonStateCallplan(): boolean {
        return this._buttonToggle.toggleButtonStates(this.gridSelectionStatusCallplan);
    }

    toggleButtonStateRatecard(): boolean {
        return this._buttonToggle.toggleButtonStates(this.gridSelectionStatusRatecard);
    }

    toggleButtonStateCode(): boolean {
        return this._buttonToggle.toggleButtonStates(this.gridSelectionStatusCode);
    }

    onRowSelectedCallplan(): void {
        this.selectedCallplanIndex = this.gridApiCallplan.getSelectedNodes()[0].rowIndex; // Get rowindex of callplan;
        this.gridSelectionStatusCallplan = this.gridApiCallplan.getSelectedNodes().length;
    }

    onRowSelectedRatecard(): void {
        this.gridSelectionStatusRatecard = this.gridApiRatecards.getSelectedNodes().length;
    }

    onRowSelectedCode(): void {
        this.gridSelectionStatusCode = this.gridApiCodes.getSelectedNodes().length;
    }

    // ================================================================================
    // Delete and Add Row Data AG Grid
    // @Todo
    // ================================================================================
    aggrid_delRow(string): void {
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
    }

    aggrid_addRow_codes(obj): void {
        this.gridApiCallplan.deselectAll();
        this.gridApiCallplan.selectNode(this.nodeSelection);
    }

    aggrid_addRow_callplans(obj): void {
        this.gridApiCallplan.updateRowData({ add: [obj] });
    }

    onCellValueChanged(params: any): void {
        const id = params.data.id;
        const date = Date.parse(params.data.valid_through).toString();
        let forPromotion: boolean;
        if ( params.data.isPurchasable === 1 || params.data.isPurchasable === 'true' ) { forPromotion = true; }
        if ( params.data.isPurchasable === 0 || params.data.isPurchasable === 'false') { forPromotion = false; }

        const detailObj = {
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
    }

    onCellValueChanged_codes(params) {
        const callplanId = this.gridApiCallplan.getSelectedRows()[0].id;
        const codesId = params.data.id;

        const codesObj = {
            ori_cc: parseInt(params.data.ori_cc, 0),
            des_cc: parseInt(params.data.des_cc, 0),
            carrier_code: params.data.carrier_code,
            planType: parseInt(params.data.planType, 0),
            priority: parseInt(params.data.priority, 0),
            day_period: parseInt(params.data.day_period, 0),
            planNumber: parseInt(params.data.planNumber, 0)
        };

        this.put_editCodes(callplanId, codesId, codesObj);
    }

    click_sendToLCR() {
        this.sendCallplanToLCR();
    }

    sendCallplanToLCR() {
        const callplan_id = this.gridApiCallplan.getSelectedNodes()[0].data.id;
        const body = {};

        this.post_callplanToLCR(callplan_id, body);
    }

    // ================================================================================
    // Dialog Callplan
    // ================================================================================
    openDialogDel(): void {
        this.callPlanSharedService.changeRowAll(this.rowIdAll);

        const dialogRef = this.dialog.open(DelCallPlanComponent, {});

        const sub = dialogRef.componentInstance.event_onDel
        .subscribe((data) => {
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
        });
    }

    openDialogAddCallPlan(): void { // Add a Call Plan
        const dialogRef = this.dialog.open(AddCallPlanComponent, {
            height: 'auto',
            width: '70vw'
        });

        const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
            this.aggrid_addRow_callplans(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
        });
    }

    // ================================================================================
    // Dialog Ratecard
    // ================================================================================
    openDialogAttachRateCard() {
        this.callPlanSharedService.changeRowAll(this.rowIdAll);

        const dialogRef = this.dialog.open(AddRateCardComponent, {
            panelClass: 'ratecard-callplan-screen-dialog',
            maxWidth: '90vw',
            autoFocus: false,
            data: this.gridApiCallplan.getSelectedRows()[0].title
        });

        dialogRef.afterClosed().subscribe(() => {
            this.gridApiCallplan.deselectAll();
            this.gridApiCallplan.selectIndex(this.selectedCallplanIndex, false, false);
        });
    }

    openDialogDetachRatecards(): void { // Dettach Rate Cards
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        this.callPlanSharedService.changeRowRatecards(this.rowSelectionRatecards);

        const dialogRef = this.dialog.open(DettachRatecardsComponent, {});

        const sub = dialogRef.componentInstance.event_onDettach
            .subscribe((data) => {
                this.aggrid_delRow(data);
            });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
        });
    }

    // ================================================================================
    // Dialog Codes
    // ================================================================================
    openDialogAttachCode() { // Add a Code to Call Plan
        this.callPlanSharedService.changeRowAll(this.rowIdAll);

        const dialogRef = this.dialog.open(AddCodeComponent, {
            height: 'auto',
            width: '70%',
        });

        dialogRef.afterClosed().subscribe(() => {
            this.gridApiCallplan.deselectAll();
            this.gridApiCallplan.selectIndex(this.selectedCallplanIndex, false, false);
        });
    }

    openDialogDetachCodes() { // Detach a code from callplan
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        this.callPlanSharedService.changeRowCodes(this.rowSelectionCodes);

        const dialogRef = this.dialog.open(DettachCodesComponent, {});

        const sub = dialogRef.componentInstance.event_onDettach
        .subscribe((data) => { // On dialog event subscription pass event data to method
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
        });
    }

}
