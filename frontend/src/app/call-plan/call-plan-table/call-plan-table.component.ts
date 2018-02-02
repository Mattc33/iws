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

@Component({
  selector: 'app-call-plan-table',
  templateUrl: './call-plan-table.component.html',
  styleUrls: ['./call-plan-table.component.scss']
})
export class CallPlanTableComponent implements OnInit {

    // AG grid row/col 
    private rowData; // All
    private columnDefs;

    private rowDataDetail; // More details 
    private columnDefsDetail;
    private columnDefsDetail2;
        private columnDefsRatecards;
        private columnDefsCodes;


    // AG grid controllers
    private gridApi: GridApi; // All
    private columnApi: ColumnApi;

    private gridApiDetail: GridApi; // More details 
    private columnApiDetail: ColumnApi;
    private gridApiDetail2: GridApi;
    private columnApiDetail2: ColumnApi;

    private gridApiRatecards: GridApi;
    private columnApiRatecards: ColumnApi;

    private gridApiCodes: GridApi;
    private columnApiCodes: GridApi;

    // Props for AG Grid
    private rowSelection;
    private rowSelectionRateCards;
    private quickSearchValue = '';

    // Props for internal service
    private callPlanRowObj;
    private rowId;

    constructor(
        private callPlanService: CallPlanService, 
        private callPlanSharedService: CallPlanSharedService,
        private dialog: MatDialog, 
        private formBuilder: FormBuilder 
    ) { }

    ngOnInit() {
        this.get_allCallPlansData(); // Get all plans API
    }

    /*
        ~~~~~~~~~~ Call Plan API services ~~~~~~~~~~
    */
        get_allCallPlansData() {
            this.callPlanService.get_allCallPlan()
                .subscribe(
                    data => { this.rowData = data; },
                    error => { console.log(error); }
                )
        }

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
        }

        put_editCallPlan(callPlanObj, callplan_id) {
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
            this.rowSelection = 'single';
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
            this.rowSelectionRateCards = 'multiple';
        }

        private on_GridReady_Codes(params): void { // init grid for codes table
            this.columnDefsCodes = this.createColumnDefsCodes();
            this.gridApiCodes = params.api;
            this.columnApiCodes = params.ColumnApi;
            this.gridApiCodes.sizeColumnsToFit();
        }

        private createColumnDefs() { // All Call plans columns
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
                    headerName: 'Available', field: 'available',

                }
            ]
        }

        private createColumnDefsDetail() { // Detailed Call plan table
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
                    headerName: 'Activated', field: 'activeWhen',
                    editable: true,
                },
                {
                    headerName: 'Plan Type', field: 'planTypeName',
                    editable: true,
                },
            ]
        }

        private createColumnDefsDetail2() {
            return [
                {
                    headerName: 'Plan Rank', field: 'ranking',
                    editable: true,
                },
                {
                    headerName: 'Promotion?', field: 'isForPromotion',
                    editable: true,
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

        private createColumnDefsRatecards() {
            return [
                {
                    headerName: 'Ratecard Name', field: 'name',
                    checkboxSelection: true, 
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
                    cellRenderer: function(params) { return params.data.add_ts}
                },
            ]
        }

        private createColumnDefsCodes() {
            return [
                {
                    headerName: 'Codes', field: 'code',
                },
                {
                    headerName: 'Origination Country', field: 'ori_cc',
                },
                {
                    headerName: 'Destination Country', field: 'dest_cc',
                },
                {
                    headerName: 'Carrier Code', field: 'carrier_code'
                },
                {
                    headerName: 'Plan Type', field: 'planType',
                },
                {
                    headerName: 'Days in Code', field: 'dayPeriod',
                },
                {
                    headerName: 'Plan Number', field: 'planNumber',
                }
            ]
        }

    /*
        ~~~~~~~~~~ Grid UI Interations ~~~~~~~~~~
    */
        aggrid_gridSizeChanged(params): void {
            params.api.sizeColumnsToFit();
        };

        aggrid_selectionChanged(): void {
            this.gridApiDetail.setRowData([]); // resets row data
            this.gridApiDetail2.setRowData([]);
            this.gridApiRatecards.setRowData([]);
            this.gridApiCodes.setRowData([]);

            this.rowSelection = this.gridApi.getSelectedRows(); // pass global row obj to row selection global var 
            this.rowId = this.rowSelection[0].id; // pass callplan row id to shared service

            this.get_specificCallPlanData(this.rowId);
        };

        aggrid_rateCards_selectionChanged(): void {
            this.rowSelectionRateCards = this.gridApi.getSelectedRows();
            this.rowId = this.rowSelection[0].id;
            console.log(this.rowSelectionRateCards);
        };

        aggrid_delRow(boolean): void {
            if (boolean === true) {
                this.gridApi.updateRowData({ remove: this.rowSelection });
            } else {
                return;
            }
        };

        aggrid_onCellValueChanged(params: any) {
            const id = params.data.id; // rates ID
            const ratecard_id = params.data.ratecard_id;
            const prefix = params.data.prefix;
            const destination = params.data.destination;
            const buy_rate = parseFloat(params.data.buy_rate);
            const buy_rate_minimum = params.data.buy_rate_minimum;
            const buy_rate_increment = params.data.buy_rate_increment;
            const sell_rate = parseFloat(params.data.sell_rate);
            const sell_rate_minimum = params.data.sell_rate_minimum;
            const sell_rate_increment = params.data.sell_rate_increment;
            
            const ratesObj = {
                ratecard_id: ratecard_id,
                prefix: prefix,
                destination: destination,
                buy_rate: buy_rate,
                buy_rate_minimum: buy_rate_minimum,
                buy_rate_increment: buy_rate_increment,
                sell_rate: sell_rate,
                sell_rate_minimum: sell_rate_minimum,
                sell_rate_increment: sell_rate_increment
            };

            this.put_editCallPlan(id, ratesObj);
        };

        aggrid_addRow(obj) {
            console.log(obj);
            this.gridApi.updateRowData({ add: [obj] });
        };


    /*
        ~~~~~~~~~~ Toolbar ~~~~~~~~~~
    */
    onQuickFilterChanged() { // external global search
        this.gridApi.setQuickFilter(this.quickSearchValue);
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */

        // Delete Call Plan
        openDialogDel(): void {
            // assign new rowObj prop
            this.callPlanSharedService.changeRowObj(this.rowId);

            const dialogRef = this.dialog.open(DelCallPlanComponent, {});

            const sub = dialogRef.componentInstance.event_onDel
            .subscribe((data) => { // do something with event data
                this.aggrid_delRow(data);
            });

            dialogRef.afterClosed().subscribe(() => {
                sub.unsubscribe();
                console.log('The dialog was closed');
            });
        } // end openDialogAdd UploadRatesDialog

        // Add a Call Plan
        openDialogAddCallPlan() {
            const dialogRef = this.dialog.open(AddCallPlanComponent, {
                height: 'auto',
                width: '50%'
            });

            const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
                // do something with event data
                this.aggrid_addRow(data);
            });

            dialogRef.afterClosed().subscribe(() => {
                sub.unsubscribe();
                console.log('The dialog was closed');
            });
        } // end openDialogAdd UploadRatesDialog

        // Add Rate Card to Call Plan
        openDialogAttachRateCard() {
            const dialogRef = this.dialog.open(AddRateCardComponent, {
                height: 'auto',
                width: '40%',
            });

            // const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
            //     // do something with event data
            //     this.aggrid_addRow(data);
            // });

            dialogRef.afterClosed().subscribe(() => {
                // sub.unsubscribe();
                console.log('The dialog was closed');
            });
        } // end openDialogAdd UploadRatesDialog

        // Add a Code to Call Plan
        openDialogAttachCode() {
            const dialogRef = this.dialog.open(AddCodeComponent, {
                height: 'auto',
                width: '40%',
            });

            // const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
            //     // do something with event data
            //     this.aggrid_addRow(data);
            // });

            dialogRef.afterClosed().subscribe(() => {
                // sub.unsubscribe();
                console.log('The dialog was closed');
            });
        } // end openDialogAdd UploadRatesDialog

}
