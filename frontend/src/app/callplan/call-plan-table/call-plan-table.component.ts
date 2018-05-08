import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GridApi } from 'ag-grid';

import { NestedAgGridService } from './../../global-service/nestedAgGrid.shared.service';
import { CallPlanService } from './../services/call-plan.api.service';
import { CallPlanSharedService } from './../services/call-plan.shared.service';
import { SnackbarSharedService } from './../../shared/services/global/snackbar.shared.service';

import { DelCallPlanComponent } from './dialog/del-callplan/del-callplan.component';
import { AddCallPlanComponent } from './dialog/add-callplan/add-callplan.component';
import { AddCodeComponent } from './dialog/add-code/add-code.component';
import { DettachRatecardsComponent } from './dialog/dettach-ratecards/dettach-ratecards.component';
import { DettachCodesComponent } from './dialog/dettach-codes/dettach-codes.component';

@Component({
  selector: 'app-call-plan-table',
  templateUrl: './call-plan-table.component.html',
  styleUrls: ['./call-plan-table.component.scss']
})
export class CallPlanTableComponent implements OnInit {

    // AG grid row/col
    private rowData;
    private rowDataRatecards;
    private columnDefs;
    private columnDefsDetail;
    private columnDefsDetail2;
    private columnDefsRatecards;
    private getNodeChildDetails;
    private columnDefsCodes;

    // AG grid controllers
    private gridApi: GridApi; // All
    private gridApiDetail: GridApi;
    private gridApiDetail2: GridApi;
    private gridApiRatecards: GridApi;
    private gridApiCodes: GridApi;
    private columnApiCodes: GridApi;

    // Props for AG Grid
    private defineRowSelectionType = 'multiple';
    private defineRowSelectionTypeS = 'single';
    private rowSelectionCallplan;
    private rowSelectionRatecards;
    private rowSelectionCodes;

    // Props for button Toggle
    private buttonToggleBoolean = true;
    private gridSelectionStatus: number;
    private buttonToggleBoolean_ratecards = true;
    private gridSelectionStatus_ratecards: number;
    private buttonToggleBoolean_codes = true;
    private gridSelectionStatus_codes: number;

    // Props for internal service
    private callPlanRowObj;
    private rowIdAll: number;
    private callplanTitle: string;
    private selectedCallplanIndex;
    private nodeSelection;

    constructor(
        private callPlanService: CallPlanService,
        private callPlanSharedService: CallPlanSharedService,
        private nestedAgGridService: NestedAgGridService,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private snackbarSharedService: SnackbarSharedService
    ) {
        this.columnDefs = this.createColumnDefs();
        this.columnDefsDetail = this.createColumnDefsDetail();
        this.columnDefsDetail2 = this.createColumnDefsDetail2();
        this.columnDefsRatecards = this.createColumnDefsRatecards();
        this.columnDefsCodes = this.createColumnDefsCodes();
    }

    ngOnInit() {
        this.getNodeChildDetails = this.setGroups();
        this.get_allCallPlansData();
    }

    /*
        ~~~~~~~~~~ Call Plan API services ~~~~~~~~~~
    */
        private get_allCallPlansData(): void {
            this.callPlanService.get_allCallplan()
                .subscribe(
                    data => { this.rowData = data; },
                    error => { console.log(error); }
                );
        }

        private get_specificCallPlanData(callPlanId: number) {
            this.callPlanService.get_specificCallplan(callPlanId)
                .subscribe(
                    data => {
                        this.callPlanSharedService.changeCallPlanObj(data);
                        this.gridApiDetail.updateRowData({ add: [data] });
                        this.gridApiDetail2.updateRowData({ add: [data] });

                        // Convert data for ratecard table
                        const ratecardData = this.nestedAgGridService.formatDataToNestedArr(data.ratecards);
                        this.gridApiRatecards.setRowData( ratecardData );

                        this.gridApiCodes.setRowData( data.codes );
                    },
                );
        }

        put_editCallPlan(callPlanObj, callplan_id): void {
            this.callPlanService.put_editCallPlan(callPlanObj, callplan_id)
                .subscribe(resp => console.log(resp));
        }

        put_editCodes(callplanId: number, codesId: number, body): void {
            this.callPlanService.put_editPlanCode(callplanId, codesId, body)
                .subscribe(resp => console.log(resp));
        }

        post_callplanToLCR(callplan_id: number, body: any): void {
            this.callPlanService.post_callplanToLCR(callplan_id, body)
                .subscribe(
                    resp => {
                        console.log(resp);
                        if ( resp.status === 200 ) {
                            this.snackbarSharedService.snackbar_success('Callplan successfully inserted into LCR.', 2000);
                        } else {
                        }
                    },
                    error => {
                        console.log(error);
                        this.snackbarSharedService.snackbar_error(
                            `Error: Something is wrong. Check if Callplan has codes, ratecards, and trunks.`, 2000);
                    }
                );
        }

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
        private on_GridReady_Callplan(params): void { // init grid for all call plans table
            this.gridApi = params.api;
            params.api.sizeColumnsToFit();
        }

        private on_GridReady_Details(params): void { // init grid for details table
            this.gridApiDetail = params.api;
            params.api.sizeColumnsToFit();
        }

        private on_GridReady_Details2(params): void { // init grid for details table2
            this.gridApiDetail2 = params.api;
            params.api.sizeColumnsToFit();
        }

        private on_GridReady_Ratecards(params): void { // init grid for ratecards table
            this.gridApiRatecards = params.api;
            params.api.sizeColumnsToFit();
        }

        private on_GridReady_Codes(params): void { // init grid for codes table
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
                        if (params.value === 1) {
                            return true;
                        }
                        if (params.value === 0) {
                            return false;
                        }
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
                    headerName: 'For Unlimited Call Plans',
                    children: [
                        {
                            headerName: 'Max Destination #', field: 'maxDestNumbers',
                            editable: true,
                        },
                        {
                            headerName: 'Max Minutes', field: 'maxMinutes',
                            editable: true,
                        },
                    ]
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

    setGroups() {
        return function getNodeChildDetails(rowItem) {
            if (rowItem.children) {
                return {
                    group: true,
                    children: rowItem.children,
                    key: rowItem.ratecard_bundle
                };
            } else {
                return null;
            }
        };
    }

    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
    aggrid_gridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

        /*
            ~~~~~ Selection ~~~~~
        */
        onSelectionChangedCallPlanTable(): void {
            this.gridApiDetail.setRowData([]); // Reset All table data
            this.gridApiDetail2.setRowData([]);
            this.gridApiRatecards.setRowData([]);
            this.gridApiCodes.setRowData([]);

            this.rowSelectionCallplan = this.gridApi.getSelectedRows(); // pass global row obj to row selection global var
            this.rowIdAll = this.rowSelectionCallplan[0].id; // pass callplan row id to global var
            this.callplanTitle = this.rowSelectionCallplan[0].title; // pass call plan title to ratecard dialog

            this.get_specificCallPlanData(this.rowIdAll);
        }

        aggrid_rateCards_selectionChanged(): void { // Selection event for ratecards table
            this.rowSelectionRatecards = this.gridApiRatecards.getSelectedRows();
        }

        aggrid_codes_selectionChanged(): void {
            this.rowSelectionCodes = this.gridApiCodes.getSelectedRows();
        }

        /*
            ~~~~~~~~~~ Button Toggle ~~~~~~~~~~
        */
        aggrid_rowSelected() {
            this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
            this.selectedCallplanIndex = this.gridApi.getSelectedNodes()[0].rowIndex; // Get rowindex of callplan;
        }

        toggleButtonStatus() {
            if ( this.gridSelectionStatus > 0 ) {
                this.buttonToggleBoolean = false;
            } else {
                this.buttonToggleBoolean = true;
            }
            return this.buttonToggleBoolean;
        }

        aggrid_rowSelected_ratecards() {
            this.gridSelectionStatus_ratecards = this.gridApiRatecards.getSelectedNodes().length;
        }

        toggleButtonStatus_ratecards() {
            if ( this.gridSelectionStatus_ratecards > 0 ) {
                this.buttonToggleBoolean_ratecards = false;
            } else {
                this.buttonToggleBoolean_ratecards = true;
            }
            return this.buttonToggleBoolean_ratecards;
        }

        aggrid_rowSelected_codes() {
            this.gridSelectionStatus_codes = this.gridApiCodes.getSelectedNodes().length;
        }

        toggleButtonStatus_codes() {
            if ( this.gridSelectionStatus_codes > 0 ) {
                this.buttonToggleBoolean_codes = false;
            } else {
                this.buttonToggleBoolean_codes = true;
            }
            return this.buttonToggleBoolean_codes;
        }

        /*
            ~~~~~~ Deletion ~~~~~~
        */
        aggrid_delRow(string): void {
            if (string === 'del-callplan') {
                this.gridApi.updateRowData({ remove: this.rowSelectionCallplan });
            }
            if (string === 'detach-ratecards') {
                console.log('del this -->');
                this.gridApi.deselectAll();
                this.gridApi.selectIndex(this.selectedCallplanIndex, false, false);
            }
            if (string === 'detach-codes') {
                this.gridApiCodes.updateRowData({ remove: this.rowSelectionCodes });
            } else {
                return;
            }
        }

        /*
            ~~~~~~ Addition ~~~~
        */
        aggrid_addRow_codes(obj): void {
            this.gridApi.deselectAll();
            this.gridApi.selectNode(this.nodeSelection);
        }

        aggrid_addRow_callplans(obj): void {
            this.gridApi.updateRowData({ add: [obj] });
        }

        /*
            ~~~~~~ Edits ~~~~
        */
        onCellValueChanged(params: any): void {
            const id = params.data.id;
            const date = Date.parse(params.data.valid_through).toString();
            let forPromotion: boolean;
            if ( params.data.isPurchasable === 1 || params.data.isPurchasable === 'true' ) {
                forPromotion = true;
            }
            if ( params.data.isPurchasable === 0 || params.data.isPurchasable === 'false') {
                forPromotion = false;
            }

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
            const callplanId = this.gridApi.getSelectedRows()[0].id;
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

    /*
        ~~~~~~~~~~ Toolbar ~~~~~~~~~~
    */
        click_sendToLCR() {
            this.sendCallplanToLCR();
        }

        sendCallplanToLCR() {
            const callplan_id = this.gridApi.getSelectedNodes()[0].data.id;
            const body = {};

            this.post_callplanToLCR(callplan_id, body);
        }

    /*
        ~~~~~~~~~~ Dialog CallPlans ~~~~~~~~~~
    */
    openDialogDel(): void {
        this.callPlanSharedService.changeRowAll(this.rowIdAll);

        const dialogRef = this.dialog.open(DelCallPlanComponent, {});

        const sub = dialogRef.componentInstance.event_onDel
        .subscribe((data) => { // do something with event data
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    }

    openDialogAddCallPlan(): void { // Add a Call Plan
        const dialogRef = this.dialog.open(AddCallPlanComponent, {
            height: 'auto',
            width: '50%'
        });

        const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
            this.aggrid_addRow_callplans(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    }

    /*
        ~~~~~~~~~~ Dialog Rate Card ~~~~~~~~~~
    */
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
            console.log('The dialog was closed');
        });
    }

    /*
        ~~~~~~~~~~ Dialog Codes ~~~~~~~~~~
    */
    openDialogAttachCode() { // Add a Code to Call Plan
        this.callPlanSharedService.changeRowAll(this.rowIdAll);

        const dialogRef = this.dialog.open(AddCodeComponent, {
            height: 'auto',
            width: '40%',
        });

        dialogRef.afterClosed().subscribe(() => {
            this.gridApi.deselectAll();
            this.gridApi.selectIndex(this.selectedCallplanIndex, false, false);
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
