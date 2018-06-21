
import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';

import { LCRService } from '../../shared/api-services/lcr/lcr.api.service';
import { LCRSharedService } from '../../shared/services/lcr/lcr.shared.service';

@Component({
  selector: 'app-lcr-trunk-table',
  templateUrl: './lcr-trunk-table.component.html',
  styleUrls: ['./lcr-trunk-table.component.scss']
})
export class LcrTrunkTableComponent implements OnInit {

    private trunkData;
    private providerData;
    private finalrowData;
    private columnDefs;

    private gridApi: GridApi;

    constructor(
        private lcrService: LCRService,
        private lcrSharedService: LCRSharedService
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
                    this.get_allProviders();
                    this.trunkData = this.lcrSharedService.get_rowDataWithProviderName(data, this.providerData);
                }
            );
    }

    get_allProviders(): void {
        this.lcrSharedService.current_providerJson.subscribe(
            data => { this.providerData = data; }
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
                headerName: 'Provider', field: 'provider_name',
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
