import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi } from 'ag-grid';

import { NestedAgGridService } from './../../global-service/nestedAgGrid.shared.service';
import { CallPlanService } from './../services/call-plan.api.service';
import { CallPlanSharedService } from './../services/call-plan.shared.service';
import { SnackbarSharedService } from './../../global-service/snackbar.shared.service';

import { DelCallPlanComponent } from './dialog/del-callplan/del-callplan.component';
import { AddCallPlanComponent } from './dialog/add-callplan/add-callplan.component';
import { AddRateCardComponent } from './dialog/add-rate-card/add-rate-card.component';
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
    private rowData; // All
    private rowDataRatecards;
    private columnDefs;
    private columnDefsDetail;
    private columnDefsDetail2;
    private columnDefsRatecards;
    private getNodeChildDetails;
    private columnDefsCodes;

    // AG grid controllers
    private gridApi: GridApi; // All
    private columnApi: ColumnApi;
    private gridApiDetail: GridApi;
    private columnApiDetail: ColumnApi;
    private gridApiDetail2: GridApi;
    private columnApiDetail2: ColumnApi;
    private gridApiRatecards: GridApi;
    private columnApiRatecards: ColumnApi;
    private gridApiCodes: GridApi;
    private columnApiCodes: GridApi;

    // Props for AG Grid
    private defineRowSelectionType = 'multiple';
    private defineRowSelectionTypeS = 'single';
    private rowSelectionAll;
    private rowSelectionRatecards;
    private rowSelectionCodes;
    private quickSearchValue = ''; // Default value for global search

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
        this.get_allCallPlansData(); // Get all plans API
    }

    /*
        ~~~~~~~~~~ Call Plan API services ~~~~~~~~~~
    */
        private get_allCallPlansData(): void {
            this.callPlanService.get_allCallPlan()
                .subscribe(
                    data => { this.rowData = data; },
                    error => { console.log(error); }
                );
        }

        private get_specificCallPlanData(callPlanId: number) {
            this.callPlanService.get_callPlan(callPlanId)
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
                            this.snackbarSharedService.snackbar_success('Callplan successfully inserted into LCR.', 5000);
                        } else {
                        }
                    },
                    error => {
                        console.log(error);
                        this.snackbarSharedService.snackbar_error(`Error: Something is wrong. Check if Callplan has codes, ratecards, and trunks.`, 5000);
                    }
                );
        }

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
        private on_GridReady(params): void { // init grid for all call plans table
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
            params.api.sizeColumnsToFit();
        }

        private on_GridReady_Details(params): void { // init grid for details table
            this.gridApiDetail = params.api;
            this.columnApiDetail = params.columnApi;
            params.api.sizeColumnsToFit();
        }

        private on_GridReady_Details2(params): void { // init grid for details table2
            this.gridApiDetail2 = params.api;
            this.columnApiDetail2 = params.columnApi;
            params.api.sizeColumnsToFit();
        }

        private on_GridReady_Ratecards(params): void { // init grid for ratecards table
            this.gridApiRatecards = params.api;
            this.columnApiRatecards = params.ColumnApi;
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
                    width: 250,
                },
                {
                    headerName: 'Carrier Name', field: 'carrier_name',
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
                },
                {
                    headerName: 'Valid Through', field: 'valid_through', editable: true,
                    // valueFormatter: function(params) {
                    //     const epoch = new Date(params.value).getTime();
                    //     return new Date(epoch * 1000).toDateString();
                    // },
                },
                {
                    headerName: 'Days in Plan', field: 'day_period', editable: true,
                },
                {
                    headerName: 'Buy Price', field: 'buy_price',
                    editable: true, filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Sell Price', field: 'sell_price',
                    editable: true, filter: 'agNumberColumnFilter'
                },
            ];
        }

        private createColumnDefsDetail2(): object {
            return [
                {
                    headerName: 'Plan Rank', field: 'ranking',
                    editable: true,
                },
                {
                    headerName: 'Activated on?', field: 'activeWhen', editable: true,
                    cellEditor: 'select', cellEditorParams: {values: ['IMMEDIATELY', 'SUCCESS_CALL']}
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
                    cellEditor: 'select', cellEditorParams: {values: ['true','false']}
                },
                {
                    headerName: 'Plan Type', field: 'planTypeName', editable: true, cellEditor: 'select',
                    cellEditorParams: {values: ['UNLIMITED_CALL_PLAN', 'PAY_AS_YOU_GO_CALL_PLAN', 'MINUTES_CALL_PLAN']}
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
                    headerCheckboxSelection: true, cellRenderer: 'agGroupCellRenderer',
                },
                {
                    headerName: 'Country', field: 'country',
                },
                {
                    headerName: 'Offer', field: 'offer',
                },
                {
                    headerName: 'Carrier Name', field: 'carrier_name',
                }
            ];
        }

        private createColumnDefsCodes(): object {
            return [
                {
                    headerName: 'Codes', field: 'code', checkboxSelection: true,
                    headerCheckboxSelection: true, width: 300,
                },
                {
                    headerName: 'Origination Country', field: 'ori_cc', editable: true,
                },
                {
                    headerName: 'Destination Country', field: 'des_cc', editable: true,
                },
                {
                    headerName: 'Carrier Code', field: 'carrier_code',
                },
                {
                    headerName: 'Plan Type', field: 'planType', editable: true,
                },
                {
                    headerName: 'Days in Code', field: 'day_period', editable: true,
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
        aggrid_selectionChanged(): void { // Selection event for All table
            this.gridApiDetail.setRowData([]); // resets row data
            this.gridApiDetail2.setRowData([]);
            this.gridApiRatecards.setRowData([]);
            this.gridApiCodes.setRowData([]);

            this.rowSelectionAll = this.gridApi.getSelectedRows(); // pass global row obj to row selection global var
            this.rowIdAll = this.rowSelectionAll[0].id; // pass callplan row id to global var
            this.callplanTitle = this.rowSelectionAll[0].title; // pass call plan title to ratecard dialog

            this.get_specificCallPlanData(this.rowIdAll);
        }

        aggrid_rateCards_selectionChanged(): void { // Selection event for ratecards table
            this.rowSelectionRatecards = this.gridApiRatecards.getSelectedRows();
            console.log(this.rowSelectionRatecards);
        }

        aggrid_codes_selectionChanged(): void {
            this.rowSelectionCodes = this.gridApiCodes.getSelectedRows();
            console.log(this.rowSelectionCodes);
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
                this.gridApi.updateRowData({ remove: this.rowSelectionAll });
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
        aggrid_addRow_ratecards(obj): void {
            this.gridApiRatecards.updateRowData({ add: obj });
        }

        aggrid_addRow_codes(obj): void {
            // this.gridApiCodes.updateRowData({ add: obj });
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
                day_period: parseInt(params.data.day_period),
                planTypeName: params.data.planTypeName,
                activeWhen: params.data.activeWhen,
                ranking: parseInt(params.data.ranking),
                isPurchasable: forPromotion,
                maxDestNumbers: parseInt(params.data.maxDestNumbers),
                maxMinutes: parseInt(params.data.maxMinutes)
            };

            this.put_editCallPlan(detailObj, id);
        }

        onCellValueChanged_codes(params) {
            const callplanId = this.gridApi.getSelectedRows()[0].id;
            const codesId = params.data.id;

            const codesObj = {
                ori_cc: parseInt(params.data.ori_cc),
                des_cc: parseInt(params.data.des_cc),
                carrier_code: params.data.carrier_code,
                planType: parseInt(params.data.planType),
                priority: parseInt(params.data.priority),
                day_period: parseInt(params.data.day_period),
                planNumber: parseInt(params.data.planNumber)
            };

            this.put_editCodes(callplanId, codesId, codesObj);
        }

    /*
        ~~~~~~~~~~ Toolbar ~~~~~~~~~~
    */
        onQuickFilterChanged(): void { // external global search
            this.gridApi.setQuickFilter(this.quickSearchValue);
        }

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
    openDialogAttachRateCard() { // Add Rate Card to Call Plan
        this.callPlanSharedService.changeRowAll(this.rowIdAll);

        const dialogRef = this.dialog.open(AddRateCardComponent, {
            panelClass: 'ratecard-callplan-screen-dialog',
            maxWidth: '90vw',
            autoFocus: false,
            data: this.gridApi.getSelectedRows()[0].title
        });

        dialogRef.afterClosed().subscribe(() => {
            this.gridApi.deselectAll();
            this.gridApi.selectIndex(this.selectedCallplanIndex, false, false);
            console.log('The dialog was closed');
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
            console.log('The dialog was closed');
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
            console.log('The dialog was closed');
        });
    }

}
