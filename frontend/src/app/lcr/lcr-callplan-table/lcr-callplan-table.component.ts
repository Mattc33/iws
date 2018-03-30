import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';

import { LCRService } from './../services/lcr.api.service';

@Component({
  selector: 'app-lcr-callplan-table',
  templateUrl: './lcr-callplan-table.component.html',
  styleUrls: ['./lcr-callplan-table.component.scss']
})
export class LcrCallPlanTableComponent implements OnInit {

    private rowData;
    private columnDefs;
    private columnDefsDetails;
    private columnDefsDetails2;

    private gridApi: GridApi;
    private gridApiDetails: GridApi;
    private gridApiDetails2: GridApi;

    constructor(
        private lcrService: LCRService,
    ) {
        this.columnDefs = this.createColumnDefs();
        this.columnDefsDetails = this.createColumnDefsReview();
        this.columnDefsDetails2 = this.createColumnDefsReview2();
    }

    ngOnInit() {
        this.get_allOffers();
    }

    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    get_allOffers(): void {
        this.lcrService.get_allOffers()
            .subscribe(
                data => {
                    this.rowData = data;
                    console.log(data);
                }
            );
    }

    get_specificOffer(carrier_id: number): void {
        this.lcrService.get_specificOffer(carrier_id)
            .subscribe(
                data => {
                    this.gridApiDetails.setRowData([data.metadata]);
                    this.gridApiDetails2.setRowData([data.metadata]);
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

    on_gridReady_details(params): void {
        this.gridApiDetails = params.api;
        params.api.sizeColumnsToFit();
    }

    on_gridReady_details2(params): void {
        this.gridApiDetails2 = params.api;
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

    private createColumnDefsReview() {
        return [
            {
                headerName: 'Title', field: 'title',
            },
            {
                headerName: 'Subtitle', field: 'subtitle',
            },
            {
                headerName: 'Type Name', field: 'typeName',
            },
            {
                headerName: 'Active When', field: 'activeWhen',
            },
            {
                headerName: 'Buy Price', field: 'buyPrice', width: 100,
            },
            {
                headerName: 'Sell Price', field: 'sellPrice', width: 100,
            },
        ];
    }

    private createColumnDefsReview2() {
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
        this.get_specificOffer(id);
    }

}
