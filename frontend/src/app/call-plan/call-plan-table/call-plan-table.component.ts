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

    private rowData;
    private columnDefs;
    private rowDataDetail;
    private columnDefsDetail;

    // AG grid props
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private gridApiDetail: GridApi;
    private columnApiDetail: GridApi;

    // Props for internal service
    private callPlanRowObj;
    private rowId;

    // Props for AG Grid
    private rowSelection;
    private quickSearchValue = '';

    constructor(private callPlanService: CallPlanService, private callPlanSharedService: CallPlanSharedService,
    private dialog: MatDialog, private formBuilder: FormBuilder ) { 
        this.columnDefs = this.createColumnDefs();
        this.rowSelection = 'single';
        this.columnDefsDetail = this.createColumnDefsDetail();
    }

    ngOnInit() {
    }

    /*
        grid
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.on_InitializeRows();
        this.gridApi.sizeColumnsToFit();
    }

    on_GridReady2(params): void {
        this.gridApiDetail = params.api;
        this.columnApiDetail = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    }

    on_InitializeRows(): void {
        this.callPlanService.get_allCallPlan()
        .subscribe(
            data => { this.rowData = data; },
            error => { console.log(error); }       
        );
    }

    // All Call plans columns
    private createColumnDefs() {
        return [
            {
                headerName: 'Call Plans', field: 'title',
                editable: true, checkboxSelection: true, 
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
            },
            {
                headerName: 'Available', field: 'available',

            },
            {
                headerName: 'Valid Through', field: 'valid_through'
            },
        ]
    }

    // Detailed Call plan table
    private createColumnDefsDetail() {
        return [
            {
                headerName: 'Sub Title', field: 'subtitle',
            },
            {
                headerName: 'Buy Price', field: 'buy_price',
            },
            {
                headerName: 'Sell Price', field: 'sell_price',
            },
            {
                headerName: 'Days in Plan', field: 'day_period',
            },
            {
                headerName: 'Plan Rank', field: 'ranking',
            },
            {
                headerName: 'Activated', field: 'activeWhen',
            },
            {
                headerName: 'Plan Type', field: 'planTypeName',

            },
            {
                headerName: 'Promotion?', field: 'isForPromotion'
            },
            {
                headerName: 'Max Destination #', field: 'maxDestNumbers',
            },
            {
                headerName: 'Max Minutes', field: 'maxMinutes',
            },
        ]
    }

    on_GridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

    on_SelectionChanged(): void {
        this.gridApiDetail.setRowData([]); //resets row data
        // const selectedRows = this.gridApi.getSelectedRows();
        this.rowSelection = this.gridApi.getSelectedRows()
        const callPlanId = this.rowSelection[0].id;

        this.rowId = callPlanId;

        this.callPlanService.get_callPlan(callPlanId)
            .subscribe(
                data => { 
                    this.callPlanSharedService.changeCallPlanObj(data); 
                    this.gridApiDetail.updateRowData({ add: [data] });
                },
            );
    }

    aggrid_delRow(boolean) {
        console.log(boolean);
        if (boolean === true) {
            this.gridApi.updateRowData({ remove: this.rowSelection });
        } else {
            return;
        }
    }

    /*
        on cell editing
    */
    aggrid_onCellValueChanged(params: any) {

        console.log (params);
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

        console.log(ratesObj);
        this.put_editCallPlan(id, ratesObj);
    }

    // call service to edit call plan
    put_editCallPlan(callPlanObj, callplan_id) {
        this.callPlanService.put_editCallPlan(callPlanObj, callplan_id) 
            .subscribe(resp => console.log(resp));
    };

    aggrid_addRow(obj) {
        console.log(obj);
        this.gridApi.updateRowData({ add: [obj] });
    }


    /* For Rate Cards Display */


    extractRateCards() {

    }

    extractCodes() {

    }

    /*
        Toolbar
    */
    onQuickFilterChanged() { // external global search
        this.gridApi.setQuickFilter(this.quickSearchValue);
    }

    /*
        Dialog
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
            width: '40%',
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
            width: '30%',
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
            width: '30%',
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
