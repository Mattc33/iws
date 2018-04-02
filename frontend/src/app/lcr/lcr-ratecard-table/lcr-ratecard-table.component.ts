import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';

import { LCRService } from './../services/lcr.api.service';

@Component({
  selector: 'app-lcr-ratecard-table',
  templateUrl: './lcr-ratecard-table.component.html',
  styleUrls: ['./lcr-ratecard-table.component.scss']
})
export class LcrRatecardTableComponent implements OnInit {

    private rowData;
    private columnDefs;
    private columnDefsRates;

    private gridApi: GridApi;
    private gridApiRates: GridApi;

    constructor(
        private lcrService: LCRService,
    ) {
        this.columnDefs = this.createColumnDefs();
        this.columnDefsRates = this.createColumnDefsRates();
    }

    ngOnInit() {
        this.get_allRatecards();
    }

    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    get_allRatecards(): void {
        this.lcrService.get_allRatecards()
            .subscribe(
                data => {
                    this.rowData = data;
                    console.log(data);
                }
            );
    }

    get_rates(ratecard_id: number): void {
        this.lcrService.get_ratesInRatecard(ratecard_id)
            .subscribe(
                data => {
                    this.gridApiRates.setRowData( data );
                    console.log(data.metadata);
                }
            );
    }

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    on_gridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    on_gridReady_rates(params): void {
        this.gridApiRates = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Id', field: 'id', checkboxSelection: true, width: 100,
            },
            {
                headerName: 'Name', field: 'name',
            },
            {
                headerName: 'Active', field: 'active', width: 100,
            },
        ];
    }

    private createColumnDefsRates() {
        return [
            {
                headerName: 'Id', field: 'id',
            },
            {
                headerName: 'Destination Id', field: 'destination_id',
            },
            {
                headerName: 'Buy Rate', field: 'buyrate',
            },
            {
                headerName: 'Sell Rate', field: 'sellrate',
            },
            {
                headerName: 'Active?', field: 'active',
            },
        ];
    }

    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    selectionChanged(params) {
        const id = this.gridApi.getSelectedRows()[0].id;
        console.log(id);
        this.get_rates(id);
    }

}
