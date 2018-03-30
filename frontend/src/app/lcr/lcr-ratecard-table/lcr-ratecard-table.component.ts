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
        this.columnDefsDetails = this.createColumnDefsReview();
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
        this.lcrService.get_rates(ratecard_id)
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
                headerName: 'code', field: 'code',
            },
            {
                headerName: 'Description', field: 'description',
            },
            {
                headerName: 'Valid Through', field: 'valid_through',
            },
        ];
    }

    private createColumnDefsRates() {
        return [
            {
                headerName: 'Day Period', field: 'dayPeriod',
            },
            {
                headerName: 'Max Dest #', field: 'maxDestNumbers',
            },
            {
                headerName: 'Max Minutes', field: 'maxMinutes',
            },
            {
                headerName: 'Ranking', field: 'ranking',
            },
            {
                headerName: 'Purchasable?', field: 'isPurchasable',
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
        this.get_rates(id);
    }

}
