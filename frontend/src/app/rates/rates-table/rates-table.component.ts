import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi } from 'ag-grid';

import { RatesService } from '../services/rates.api.service';

@Component({
    selector: 'app-rates-table',
    templateUrl: './rates-table.component.html',
    styleUrls: ['./rates-table.component.scss']
})
export class RatesTableComponent implements OnInit {

    // Define row and column data
    private rowData;
    private columnDefs;

    // AG grid props
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // Properties for internal service
    private rowSelection;
    private rowID: number;

    constructor(private ratesService: RatesService) {
        this.columnDefs = this.createColumnDefs();
        this.rowSelection = 'single';
    }

    ngOnInit() {
        this.on_InitializeRows();
    }

    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    }

    on_InitializeRows(): void {
        this.ratesService.get_Rates()
        .subscribe(
            data => { this.rowData = data; },
            error => { console.log(error); }
        );
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Rate Card Name', field: 'ratecard_name',
            },
            {
                headerName: 'Prefix', field: 'prefix',
            },
            {
                headerName: 'Destination', field: 'destination',
            },
            {
                headerName: 'Buy Rate', field: 'buy_rate',
                editable: true
            },
            {
                headerName: 'Sell Rate', field: 'sell_rate',
            },
        ];
    }

    // When width of parent (e) has been changed, fire this event to resize col
    on_GridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

}
