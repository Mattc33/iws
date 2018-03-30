import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';

import { LCRService } from './../services/lcr.api.service';

@Component({
  selector: 'app-lcr-carrier-table',
  templateUrl: './lcr-carrier-table.component.html',
  styleUrls: ['./lcr-carrier-table.component.scss']
})
export class LcrCarrierTableComponent implements OnInit {

    private rowData;
    private columnDefs;

    private gridApi: GridApi;

    constructor(
        private lcrService: LCRService,
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_allCarriers();
    }

    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    get_allCarriers(): void {
        this.lcrService.get_allCarriers()
            .subscribe(
                data => {
                    this.rowData = data;
                    console.log(data);
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

    private createColumnDefs() {
        return [
            {
                headerName: 'Id', field: 'id', width: 100,
            },
            {
                headerName: 'Name', field: 'name',
            },
            {
                headerName: 'Rates Email', field: 'alerts_email',
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

}
