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
    private rowDataTeleU;
    private columnDefs;
    private columnDefsTeleU;

    private columnTypes;

    // AG grid props
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // Properties for internal service
    private rowSelection;
    private rowID: number;

    constructor(private ratesService: RatesService) {
        this.columnDefs = this.createColumnDefs();
        this.columnDefsTeleU = this.createColumnDefsTeleU();
        this.rowSelection = 'single';
    }

    ngOnInit() {
        this.on_InitializeRows();
        this.on_InitializeRowsTeleU();
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

    on_InitializeRowsTeleU(): void {
        this.ratesService.get_TeleURates()
        .subscribe(
            data => { this.rowDataTeleU = data; },
            error => { console.log(error); }
        );
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'All Rates',
                children: [
                    {
                        headerName: 'Rate Card Name', field: 'ratecard_name'
                    },
                    {
                        headerName: 'Prefix', field: 'prefix',
                        editable: true, filter: 'agNumberColumnFilter'
                    },
                    {
                        headerName: 'Destination', field: 'destination',
                        editable: true
                    },
                    {
                        headerName: 'Buy Rate', field: 'buy_rate', editable: true, filter: 'agNumberColumnFilter'
                    },
                    {
                        headerName: 'Sell Rate', field: 'sell_rate', editable: true, filter: 'agNumberColumnFilter'
                    },
                    {
                        headerName: 'Difference',
                        valueGetter: function(params) {
                          const diff = (params.data.sell_rate - params.data.buy_rate);
                          const percent = ((diff) / params.data.buy_rate) * 100;
                          const diffFixed = diff.toFixed(4);
                          const percentFixed = percent.toFixed(2);

                          return `${diffFixed}(${percentFixed}%)`;
                        }
                    },
                ]
            }
        ];
    }

    private createColumnDefsTeleU() {
        return [
            {
            headerName: 'Tele-U',
            children: [
                {
                    headerName: 'Prefix', field: 'prefix',
                    editable: true,
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Destination', field: 'destination',
                    editable: true
                },
                {
                    headerName: 'Buy Rate', field: 'buy_rate',
                    editable: true,
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Sell Rate', field: 'sell_rate',
                    editable: true,
                    filter: 'agNumberColumnFilter'
                },
            ]
            }
        ];
    }

    // When width of parent (e) has been changed, fire this event to resize col
    on_GridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

}
