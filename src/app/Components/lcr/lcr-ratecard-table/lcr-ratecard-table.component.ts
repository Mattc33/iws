import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';

import { LCRService } from '../../../shared/api-services/lcr/lcr.api.service';
import { LCRSharedService } from '../../../shared/services/lcr/lcr.shared.service';

@Component({
  selector: 'app-lcr-ratecard-table',
  templateUrl: './lcr-ratecard-table.component.html',
  styleUrls: ['./lcr-ratecard-table.component.scss']
})
export class LcrRatecardTableComponent implements OnInit {

    rowData;
    columnDefs;
    columnDefsRates;

    providerData;

    gridApi: GridApi;
    gridApiRates: GridApi;

    constructor(
        private lcrService: LCRService,
        private lcrSharedService: LCRSharedService
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
                    this.get_allProviders();
                    this.rowData = this.lcrSharedService.get_rowDataWithProviderName(data, this.providerData);
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

    on_gridReady_rates(params): void {
        this.gridApiRates = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Id', field: 'id', checkboxSelection: true, width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Provider', field: 'provider_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active', field: 'active', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
        ];
    }

    private createColumnDefsRates() {
        return [
            {
                headerName: 'Id', field: 'id',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination Id', field: 'destination_id',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Rate', field: 'buyrate',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Rate', field: 'sellrate',
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

    selectionChanged(params) {
        const id = this.gridApi.getSelectedRows()[0].id;
        console.log(id);
        this.get_rates(id);
    }

}
