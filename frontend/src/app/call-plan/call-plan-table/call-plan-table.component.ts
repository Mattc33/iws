import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi } from 'ag-grid';

import { CallPlanService } from './../services/call-plan.api.service';
import { CallPlanSharedService } from './../services/call-plan.shared.service';

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
    private columnDefs;

    private columnDefsDetail;
    private columnDefsDetail2;

    private columnDefsRatecards;
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

    // Props for internal service
    private callPlanRowObj;
    private rowIdAll;

    constructor(
        private callPlanService: CallPlanService, 
        private callPlanSharedService: CallPlanSharedService,
        private dialog: MatDialog, 
        private formBuilder: FormBuilder 
    ) { 
    }

    ngOnInit() {
        this.get_allCallPlansData(); // Get all plans API
    }

    /*
        ~~~~~~~~~~ Call Plan API services ~~~~~~~~~~
    */
        get_allCallPlansData(): void {
            this.callPlanService.get_allCallPlan()
                .subscribe(
                    data => { this.rowData = data; },
                    error => { console.log(error); }
                )
        };

        get_specificCallPlanData(callPlanId: number) { //updates shared obj and grid right after api call
            this.callPlanService.get_callPlan(callPlanId)
                .subscribe(
                    data => { 
                        this.callPlanSharedService.changeCallPlanObj(data); 
                        this.gridApiDetail.updateRowData({ add: [data] });
                        this.gridApiDetail2.updateRowData({ add: [data] });
                        this.gridApiRatecards.updateRowData({ add: data.ratecards });
                        this.gridApiCodes.updateRowData({ add: data.codes });
                    },
                );
        };

        put_editCallPlan(callPlanObj, callplan_id): void {
            this.callPlanService.put_editCallPlan(callPlanObj, callplan_id) 
                .subscribe(resp => console.log(resp));
        };

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
        private on_GridReady(params): void { // init grid for all call plans table
            this.columnDefs = this.createColumnDefs();
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
            this.gridApi.sizeColumnsToFit();
        }

        private on_GridReady_Details(params): void { // init grid for details table
            this.columnDefsDetail = this.createColumnDefsDetail();
            this.gridApiDetail = params.api;
            this.columnApiDetail = params.columnApi;
            this.gridApiDetail.sizeColumnsToFit();
        }

        private on_GridReady_Details2(params): void { // init grid for details table2
            this.columnDefsDetail2 = this.createColumnDefsDetail2();
            this.gridApiDetail2 = params.api;
            this.columnApiDetail2 = params.columnApi;
            this.gridApiDetail2.sizeColumnsToFit();
        }

        private on_GridReady_Ratecards(params): void { // init grid for ratecards table
            this.columnDefsRatecards = this.createColumnDefsRatecards();
            this.gridApiRatecards = params.api;
            this.columnApiRatecards = params.ColumnApi;
            this.gridApiRatecards.sizeColumnsToFit();
        }

        private on_GridReady_Codes(params): void { // init grid for codes table
            this.columnDefsCodes = this.createColumnDefsCodes();
            this.gridApiCodes = params.api;
            this.columnApiCodes = params.ColumnApi;
            this.gridApiCodes.sizeColumnsToFit();
        }

        private createColumnDefs(): object { // All Call plans columns
            return [
                {
                    headerName: 'Call Plans', field: 'title',
                    editable: true, checkboxSelection: true, 
                    width: 250,
                },
                {
                    headerName: 'Carrier Name', field: 'carrier_name',
                },
                {
                    headerName: 'Available', field: 'available', editable: true,
                    cellEditor: "select", cellEditorParams: {values: ['available','unavailable','deleted','staged','pending']}
                }
            ]
        }

        private createColumnDefsDetail(): object { // Detailed Call plan table
            return [
                {
                    headerName: 'Sub Title', field: 'subtitle',
                    editable: true,
                },
                {
                    headerName: 'Valid Through', field: 'valid_through',
                    editable: true,
                },
                {
                    headerName: 'Buy Price', field: 'buy_price',
                    editable: true,
                },
                {
                    headerName: 'Sell Price', field: 'sell_price',
                    editable: true,
                },
                {
                    headerName: 'Days in Plan', field: 'day_period',
                    editable: true,
                },
                {
                    headerName: 'Activated', field: 'activeWhen', editable: true,
                    cellEditor: "select", cellEditorParams: {values: ['IMMEDIATELY','SUCCESS_CALL']}
                },
                {
                    headerName: 'Plan Type', field: 'planTypeName', editable: true,
                    cellEditor: "select", cellEditorParams: {values: ['UNLIMITED_CALL_PLAN','PAY_AS_YOU_GO_CALL_PLAN','MINUTES_CALL_PLAN']}
                },
            ]
        }

        private createColumnDefsDetail2(): object {
            return [
                {
                    headerName: 'Plan Rank', field: 'ranking',
                    editable: true,
                },
                {
                    headerName: 'Promotion?', field: 'isForPromotion', editable: true,
                    cellEditor: "select", cellEditorParams: {values: ['true','false']}
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
                },
                {
                    headerName: 'Data Base Times',
                    children: [
                        {
                            headerName: 'Added to Data Base', field: 'start_ts',
                        },
                        {
                            headerName: 'End Time Stamp', field: 'end_ts',
                        },
                        {
                            headerName: 'Last Date of Edit', field: 'add_ts',
                        }
                    ]
                }
            ]
        }

        private createColumnDefsRatecards(): object {
            return [
                {
                    headerName: 'Ratecard Name', field: 'name', checkboxSelection: true,
                    headerCheckboxSelection: true
                },
                {
                    headerName: 'Carrier Name', field: 'carrier_name',
                },
                {
                    headerName: 'Start TS', field: 'start_ts',
                },
                {
                    headerName: 'End TS', field: 'end_ts',
                },
                {
                    headerName: 'Add TS', field: 'add_ts',
                },
            ]
        }

        private createColumnDefsCodes(): object {
            return [
                {
                    headerName: 'Codes', field: 'code', checkboxSelection: true,
                    headerCheckboxSelection: true
                },
                {
                    headerName: 'Origination Country', field: 'ori_cc',
                },
                {
                    headerName: 'Destination Country', field: 'des_cc',
                },
                {
                    headerName: 'Carrier Code', field: 'carrier_code'
                },
                {
                    headerName: 'Plan Type', field: 'planType',
                },
                {
                    headerName: 'Days in Code', field: 'day_period',
                },
                {
                    headerName: 'Plan Number', field: 'planNumber',
                }
            ]
        }

    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
        aggrid_gridSizeChanged(params): void {
            params.api.sizeColumnsToFit();
        };
        /*
            ~~~~~ Selection ~~~~~
        */
            aggrid_selectionChanged(): void { // Selection event for All table
                this.gridApiDetail.setRowData([]); // resets row data
                this.gridApiDetail2.setRowData([]);
                this.gridApiRatecards.setRowData([]);
                this.gridApiCodes.setRowData([]);

                this.rowSelectionAll = this.gridApi.getSelectedRows(); // pass global row obj to row selection global var 
                this.rowIdAll = this.rowSelectionAll[0].id; // pass callplan row id to shared service

                this.get_specificCallPlanData(this.rowIdAll);
            };

            aggrid_rateCards_selectionChanged(): void { // Selection event for ratecards table
                this.rowSelectionRatecards = this.gridApiRatecards.getSelectedRows();
                console.log(this.rowSelectionRatecards);
            };

            aggrid_codes_selectionChanged(): void {
                this.rowSelectionCodes = this.gridApiCodes.getSelectedRows();
                console.log(this.rowSelectionCodes);
            }
        
        /*
            ~~~~~~ Deletion ~~~~~~
        */
        aggrid_delRow(string): void {
            if (string === 'del-callplan') {
                this.gridApi.updateRowData({ remove: this.rowSelectionAll });
            }
            if (string === 'detach-ratecards') {
                this.gridApiRatecards.updateRowData({ remove: this.rowSelectionRatecards });
            }
            if (string === 'detach-codes') {
                this.gridApiCodes.updateRowData({ remove: this.rowSelectionCodes });
            }
            else {
                return;
            }
        };

        /*
            ~~~~~~ Addition ~~~~
        */
            aggrid_addRow_ratecards(obj): void {
                this.gridApiRatecards.updateRowData({ add: [obj] });
            };

            aggrid_addRow_codes(obj): void {
                this.gridApiCodes.updateRowData({ add: [obj] });
            }

            aggrid_addRow_callplans(obj): void {
                this.gridApi.updateRowData({ add: [obj] });
            }

        /*
            ~~~~~~ Edits ~~~~
        */           
            aggrid_all_onCellValueChanged(params: any): void {
                const id = params.data.id;

                const callplanObj = {
                    carrier_id: params.data.carrier_id,
                    available: params.data.available
                };

                this.put_editCallPlan(callplanObj, id);
            };

            aggrid_detail_onCellValueChanged(params: any): void {
                const id = params.data.id; // rates ID
                const date = Date.parse(params.data.valid_through).toString();

                const callplanObj = {
                    subtitle: params.data.subtitle,
                    valid_through: date,
                    buy_price: params.data.buy_price,
                    sell_price: params.data.sell_price,
                    day_period: params.data.day_period,
                    ranking: params.data.ranking,
                    planTypeName: params.data.planTypeName,
                    activeWhen: params.data.activeWhen
                };

                this.put_editCallPlan(callplanObj, id);
            };

            aggrid_detail2_onCellValueChanged(params: any): void {
                const id = params.data.id; // rates ID
                console.log(params);

                const callplanObj = {
                    ranking: params.data.ranking,
                    isForPromotion: params.data.isForPromotion,
                    maxDestNumbers: params.data.maxDestNumbers,
                    maxMinutes: params.data.maxMinutes
                };

                this.put_editCallPlan(callplanObj, id);
            };

    /*
        ~~~~~~~~~~ Toolbar ~~~~~~~~~~
    */
        onQuickFilterChanged(): void { // external global search
            this.gridApi.setQuickFilter(this.quickSearchValue);
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
            const dialogRef = this.dialog.open(AddRateCardComponent, {
                height: 'auto',
                width: '40%',
            });

            const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
                this.aggrid_addRow_ratecards(data);
            });

            dialogRef.afterClosed().subscribe(() => {
                sub.unsubscribe();
                console.log('The dialog was closed');
            });
        }

        openDialogDetachRatecards(): void { // Dettach Rate Cards
            this.callPlanSharedService.changeRowAll(this.rowIdAll);
            this.callPlanSharedService.changeRowRatecards(this.rowSelectionRatecards);

            const dialogRef = this.dialog.open(DettachRatecardsComponent, {});

            const sub = dialogRef.componentInstance.event_onDettach
            .subscribe((data) => { // do something with event data
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
            const dialogRef = this.dialog.open(AddCodeComponent, {
                height: 'auto',
                width: '40%',
            });

            const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
                this.aggrid_addRow_codes(data);
            });

            dialogRef.afterClosed().subscribe(() => {
                sub.unsubscribe();
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
