import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';

import { LCRService } from '../../shared/api-services/lcr/lcr.api.service';
import { LCRSharedService } from '../../shared/services/lcr/lcr.shared.service';

@Component({
  selector: 'app-lcr-carrier-table',
  templateUrl: './lcr-carrier-table.component.html',
  styleUrls: ['./lcr-carrier-table.component.scss']
})
export class LcrCarrierTableComponent implements OnInit {

    rowData;
    columnDefs;

    gridApi: GridApi;

    constructor(
        private lcrService: LCRService,
        private lcrSharedService: LCRSharedService
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
                    this.lcrSharedService.change_providerJson(data);
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
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Rates Email', field: 'alerts_email',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
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
