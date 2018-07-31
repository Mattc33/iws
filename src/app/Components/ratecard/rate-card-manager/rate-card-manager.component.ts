import { Component, OnInit, ViewChild } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid';

import { CarrierService } from './../../../shared/api-services/carrier/carrier.api.service';
import { CarrierCellComponent } from './carrier-cell/carrier-cell.component';
import { ObietelCellComponent } from './obietel-cell/obietel-cell.component';
import { RateTableModalComponent } from './rate-table-modal/rate-table-modal.component';

@Component({
  selector: 'app-rate-card-manager',
  templateUrl: './rate-card-manager.component.html',
  styleUrls: ['./rate-card-manager.component.scss']
})
export class RateCardManagerComponent implements OnInit {

    @ViewChild(RateTableModalComponent) _rateTableModal: RateTableModalComponent;

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

    // ! Passed to Modal
    carrierCellInfo;

    constructor(
        private _CarrierService: CarrierService
    ) {
        this.columnDefs = this.createColumnDefs();
        this.context = {rateCardManagerTableComponent: this};
        this.frameworkComponents = {
            _carrierCellComponent: CarrierCellComponent,
            _obietelCellComponent: ObietelCellComponent
        };
    }

    ngOnInit() {
        this.getCarriers();
    }

    // ================================================================================
    // * Service
    // ================================================================================
    getCarriers(): void {
        const carrierObservable = this._CarrierService.get_carriers();
        carrierObservable.subscribe(
            data =>  {
                this.toCarrierOptions = data;
                this.fromCarrierOptions = data;
                console.log(data);
            },
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

    fromCarrierChangeHandler(carrierIdArr): void { // * responsible for adding the right carriers as cols to grid
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
                width: 180, cellStyle: { 'border-right': '1px solid #E0E0E0' },
                cellRenderer: '_carrierCellComponent',
                // self-defined values
                ratecard_id: '<insert ratecard_id here>'
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

    _find = (array, key, value) => array.find( obj => obj[key] === value);

    // ================================================================================
    // * Event Handlers From Cells
    // ================================================================================
    fromCarrierCellToggleHandler(cell: Object, checkboxValue: boolean): void {
        console.log(cell);
        console.log(checkboxValue);
    }

    fromCarrierCellInfoHandler(cell: Object): void {
        // open a modal, set global var to cell obj which is later passed to modal via @Input
        this.carrierCellInfo = cell;
        this._rateTableModal.showModal();
    }

    obieCellInfoHandler(cell: Object): void {
        console.log('obie info', cell);
        this.carrierCellInfo = cell;
        this._rateTableModal.showModal();
    }

    // ================================================================================
    // * AG Grid
    // ================================================================================
    // ? Grid Initiation
    createColumnDefs(): Array<{}> {
        const commonCellStyle = { 'border-right': '1px solid #ccc', 'line-height': '70px',
        'text-align': 'center' };

        return [
            {
                headerName: 'Countries', field: 'countries', colId: 'countries', width: 120,
                cellStyle: { 'border-right': '1px solid #000', 'line-height': '70px',
                'text-align': 'center', 'font-weight': 'bold' },
            },
            {
                headerName: 'Obie Rate', field: 'finalRate', colId: 'finalRate', width: 210,
                cellStyle: { 'border-right': '1px solid #E0E0E0', 'border-left': '1px solid #000' },
                cellRenderer: '_obietelCellComponent'
            },
            {
                headerName: 'Min Rate', field: 'fixedMinimumRate', colId: 'fixedMinimumRate',
                width: 120,
                cellStyle: commonCellStyle,
            },
            {
                headerName: 'Prev Rate', field: 'previousRate', colId: 'previousRate',
                width: 120,
                cellStyle: commonCellStyle,
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
        // params.api.sizeColumnsToFit();
        this.gridApi.setRowData(this.createRowData());
    }
}
