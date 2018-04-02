import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';

import { LCRService } from './../services/lcr.api.service';

@Component({
  selector: 'app-lcr-trunk-table',
  templateUrl: './lcr-trunk-table.component.html',
  styleUrls: ['./lcr-trunk-table.component.scss']
})
export class LcrTrunkTableComponent implements OnInit {

    private rowData;
    private columnDefs;

    private gridApi: GridApi;

    constructor(
        private lcrService: LCRService,
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_allTrunks();
    }

    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    get_allTrunks(): void {
        this.lcrService.get_allTrunks()
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
                headerName: 'Cloudonix Id', field: 'cx_trunk_id',
            },
            {
                headerName: 'Provider Id', field: 'provider_id',
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
