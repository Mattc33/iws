import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid';

import { CarrierService } from './../../../shared/api-services/carrier/carrier.api.service';
import { CarrierCellComponent } from './carrier-cell/carrier-cell.component';

@Component({
  selector: 'app-rate-card-manager',
  templateUrl: './rate-card-manager.component.html',
  styleUrls: ['./rate-card-manager.component.scss']
})
export class RateCardManagerComponent implements OnInit {

    // ! Top Toolbar
    // * Select Dropdown Option Values
    toCarrierOptions: any;
    fromCarrierOptions: Array<{}>;
    productTierOptions: Array<{}> = [
        {label: 'Standard', value: 'standard'},
        {label: 'Premium', value: 'premium'}
    ];

    // * Selected Values
    toCarrierValue: string;
    fromCarrierValue: Array<string>;
    productTierValue: String;

    // ! AG Grid
    // * row data and column definitions
    rowData: any[];
    columnDefs;

    // * gridApi
    gridApi: GridApi;
    columnApi: ColumnApi;

    // * gridUI props
    context;
    frameworkComponents;

    constructor(
        private _CarrierService: CarrierService
    ) {
        this.columnDefs = this.createColumnDefs();
        this.context = {rateCardManagerTableComponent: this};
        this.frameworkComponents = {
            _carrierCellComponent: CarrierCellComponent
        };
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

    // ================================================================================
    // * Event Handlers
    // ================================================================================
    toCarrierChangeHandler(e): void {
        const carrierId = e;
        console.log(carrierId);
        this.gridApi.setRowData(this.createRowData());
    }

    fromCarrierChangeHandler(carrierIdArr): void {
        const lookupArr = [];
        carrierIdArr.forEach(carrier => {
            const lookupItem = this._find(this.toCarrierOptions, 'id', carrier );
            if (lookupItem) {
                lookupArr.push(lookupItem);
            }
        });

        const carrierColDefs = lookupArr.map( carrier => {
            return {
                headerName: carrier.name, field: carrier.id.toString(), coldId: carrier.id.toString(),
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                cellRenderer: '_carrierCellComponent'
            };
        });

        const countries = [this._find(this.columnDefs, 'colId', 'countries')];
        const obietelCols = [
            this._find(this.columnDefs, 'colId', 'finalRate'),
            this._find(this.columnDefs, 'colId', 'fixedMinimumRate'),
            this._find(this.columnDefs, 'colId', 'previousRate')
        ];

        this.gridApi.setColumnDefs([].concat(countries, carrierColDefs, obietelCols));
    }

    productTierChangeHandler(): void {

    }

    testConsoleLog(cell) {
        alert(`Parent Component Method from: ${cell}`);
    }

    _find = (array, key, value) => array.find( obj => obj[key] === value);



    // ? Grid Initiation
    createColumnDefs(): Array<{}> {
        return [
            {
                headerName: 'Countries', field: 'countries', colId: 'countries',
                cellStyle: { 'border-right': '1px solid #000' },
            },
            {
                headerName: 'Final Rate', field: 'finalRate', colId: 'finalRate',
                cellStyle: { 'border-right': '1px solid #E0E0E0', 'border-left': '1px solid #000' },
            },
            {
                headerName: 'Min Rate', field: 'fixedMinimumRate', colId: 'fixedMinimumRate',
                width: 120,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Prev Rate', field: 'previousRate', colId: 'previousRate',
                width: 120,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'test cell',
                cellRenderer: '_carrierCellComponent'
            }
        ];
    }

    createRowData(): Array<{}> {
        return [
            {
                countries: 'Afghanistan',
                finalRate: 3,
                fixedMinimumRate: 2,
                previousRate: 2.5
                // ! i need to attach each carrier's rate here
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
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    }
}
