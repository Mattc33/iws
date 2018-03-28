import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid';

import { LCRService } from './../services/lcr.api.service';

@Component({
  selector: 'app-lcr-table',
  templateUrl: './lcr-table.component.html',
  styleUrls: ['./lcr-table.component.scss']
})
export class LcrTableComponent implements OnInit {

    private rowData;
    private columnDefs;
    private columnDefsDetails;

    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private gridApiDetails: GridApi;
    private columnApiDetails: ColumnApi;

    constructor(
        private lcrService: LCRService,
    ) {
        this.columnDefs = this.createColumnDefs();
        this.columnDefsDetails = this.createColumnDefsReview();
    }

    ngOnInit() {
        this.lcrService.get_allOffers().subscribe(data => this.rowData = data);
    }

    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    on_InitializeRows(): void {

    }

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    on_GridReady(params): void {

    }

    on_GridReady_details(params): void {

    }

    private createColumnDefs() {
        return [
            {
                headerName: '',
            },
            {
                headerName: '',
            },
            {
                headerName: '',
            },
        ];
    }

    private createColumnDefsReview() {
        return [
            {
                headerName: '',
            },
            {
                headerName: '',
            },
            {
                headerName: '',
            },
        ];
    }

    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

}
