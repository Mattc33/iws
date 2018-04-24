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
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'code', field: 'code',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Description', field: 'description',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Valid Through', field: 'valid_through',
                valueFormatter: params => new Date(params.value * 1000).toDateString()
            },
        ];
    }

    private createColumnDefsReview() {
        return [
            {
                headerName: 'Title', field: 'title',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Subtitle', field: 'subtitle',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Type Name', field: 'typeName',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active When', field: 'activeWhen',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Price', field: 'buyPrice', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Price', field: 'sellPrice', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
        ];
    }

    private createColumnDefsReview2() {
        return [
            {
                headerName: 'Day Period', field: 'dayPeriod',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Max Dest #', field: 'maxDestNumbers',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Max Minutes', field: 'maxMinutes',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Ranking', field: 'ranking',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
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
