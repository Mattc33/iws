import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';

import { CarrierService } from './../../../shared/api-services/carrier/carrier.api.service';

@Component({
  selector: 'app-rate-card-manager',
  templateUrl: './rate-card-manager.component.html',
  styleUrls: ['./rate-card-manager.component.scss']
})
export class RateCardManagerComponent implements OnInit {

    // * Select Dropdown Option Values
    toCarrierOptions: Array<{}>;
    fromCarrierOptions: Array<{}>;
    productTierOptions: Array<{}> = [
        {label: 'Standard', value: 'standard'},
        {label: 'Premium', value: 'premium'}
    ];

    // * Selected Values
    toCarrierValue: string;
    fromCarrierValue: Array<string>;
    productTierValue: String;

    // * row data and column definitions
    rowData;
    columnDefs;

    // * gridApi & gridUI props
    gridApi: GridApi;

    constructor(
        private _CarrierService: CarrierService
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.getCarriers();
    }

    // ? Services
    getCarriers(): void {
        const carrierObservable = this._CarrierService.get_carriers();
        carrierObservable.subscribe(
            data =>  { this.toCarrierOptions = data; this.fromCarrierOptions = data; console.log(data); },
            error =>  console.log(error)
        );
    }

    // ? Event Handlers
    toCarrierChangeHandler(e): void {
        const carrierId = e;
        console.log(carrierId);
        
    }

    fromCarrierChangeHandler(e): void {
        const carrierArr = e;
        const howManyCarriers = carrierArr.length;
        console.log(carrierArr);

        // this.gridApi.
    }

    productTierChangeHandler(): void {

    }

    testButton(): void {
        const rowData = this.createRowData();
        this.gridApi.setRowData(rowData);
    }

    // ? Grid Initiation
    createColumnDefs(): Array<{}> {
        return [
            {
                headerName: 'Countries', field: 'countries',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Final Rate', field: 'finalRate',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Fixed Min Rate', field: 'fixedMinimumRate',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Previous Rate', field: 'previousRate',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
        ];
    }

    createRowData(): Array<{}> {
        return [
            {
                countries: 'Afghanistan',
                finalRate: 3,
                fixedMinimumRate: 2,
                previousRate: 2.5
            },
            {
                countries: 'Albania',
                finalRate: 3,
                fixedMinimumRate: 2,
                previousRate: 2.5
            },
            {
                countries: 'Algeria',
                finalRate: 3,
                fixedMinimumRate: 2,
                previousRate: 2.5
            }
        ];
    }

    onGridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }



}
