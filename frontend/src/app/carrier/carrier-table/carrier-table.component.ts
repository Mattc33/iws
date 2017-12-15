import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CarrierService } from './../services/carrier.service';
import { CommonModule } from '@angular/common';

import { GridOptions, GridApi } from 'ag-grid';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';

@Component({
  selector: 'app-carrier-table',
  templateUrl: './carrier-table.component.html',
  styleUrls: ['./carrier-table.component.scss'],
  providers: [ CarrierService ],
  encapsulation: ViewEncapsulation.None
})

export class CarrierTableComponent implements OnInit {

    // row data and column definitions
    private rowData;
    private columnDefs;

    // gridApi and columnApi
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // inject your service
    constructor( private carrierService: CarrierService ) {
        this.columnDefs = this.createColumnDefs();
    }

    // on init, subscribe to the the Observable from your service
    ngOnInit() {
        this.carrierService.initialLoad()
            .subscribe(
                data => { this.rowData = data; },
                error => { console.log(error); }
            );
    }

    // on grid initialisation, grap the APIs and auto resize the columns to fit the available space
    onGridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    }

    // create column definitions
    private createColumnDefs() {
        return [
            // ID
            {
                headerName: 'ID', field: 'carrier_id',
            },
            // Name
            {
                headerName: 'Name', field: 'carrier_name',
                editable: true,
            },
            // Phone Number
            {
                headerName: 'Phone Number', field: 'phone_number',
                editable: true
            },
            // Email
            {
                headerName: 'Email', field: 'email',
                editable: true
            },
            // Address
            {
                headerName: 'Address', field: 'address',
                editable: true
            },
            // Taxable
            {
                headerName: 'Taxable', field: 'taxable',
                editable: true
            },
            // Tier Number
            {
                headerName: 'Tier Number', field: 'tier_number',
                editable: true
            },
            // Two Digit Code
            {
                headerName: 'Two Digit Code', field: 'two_digit_unique_code',
                editable: true
            },
        ];
    }

    // When width of parent (e) has been changed, fire this event to resize col
    onGridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }
    //
} // end class


