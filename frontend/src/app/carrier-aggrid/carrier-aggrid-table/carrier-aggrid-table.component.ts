import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CarrierAggridService } from './../services/carrier.service';
import { CommonModule } from '@angular/common';

import { GridOptions, GridApi } from 'ag-grid';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';

@Component({
  selector: 'app-carrier-aggrid-table',
  templateUrl: './carrier-aggrid-table.component.html',
  styleUrls: ['./carrier-aggrid-table.component.scss'],
  providers: [ CarrierAggridService ],
  encapsulation: ViewEncapsulation.None
})

export class CarrierAggridTableComponent implements OnInit {

    // row data and column definitions
    private rowData;
    private columnDefs;

    // gridApi and columnApi
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // inject your service
    constructor( private carrierAggridService: CarrierAggridService ) {
        this.columnDefs = this.createColumnDefs();
    }

    // on init, subscribe to the the Observable from your service
    ngOnInit() {
        this.carrierAggridService.initialLoad()
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
            {
                headerName: 'Data Base Details',
                marryChildren: true,
                children: [
                            // ID
                            {
                                headerName: 'ID', field: 'id', width: 100,
                            },
                            // Date
                            {
                                headerName: 'Date', field: 'date', width: 150,
                            },
                ]
            },
            // Name
            {
                headerName: 'Name', field: 'name', width: 120,
                editable: true,
            },
            // Phone Number
            {
                headerName: 'Phone Number', field: 'phone_number', width: 150,
                editable: true
            },
            // Address
            {
                headerName: 'Address', field: 'address', width: 150,
                editable: true
            },
            // Taxable
            {
                headerName: 'Taxable', field: 'taxable', width: 120,
                editable: true
            },
            // Tier Number
            {
                headerName: 'Tier Number', field: 'tier_number', width: 150,
                editable: true
            },
            // Two Digit Code
            {
                headerName: 'Two Digit Code', field: 'two_digit_unique_code', width: 120,
                editable: true
            },
        ];
    }

    // When width of parent (e) has been changed, fire this event to resize col
    onGridSizeChanged(params) {
        // let gridWidth = document.getElementById("grid-wrapper").offsetWidth;
        // let columnsToShow = [];
        // let columnsToHide = [];
        // let totalColsWidth = 0;
        // let allColumns = params.columnApi.getAllColumns();
        // for (let i = 0; i < allColumns.length; i++) {
        //     const column = allColumns[i];
        //     totalColsWidth += column.getMinWidth();
        //     if (totalColsWidth > gridWidth) {
        //     columnsToHide.push(column.colId);
        //     } else {
        //     columnsToShow.push(column.colId);
        //     }
        // }
        // params.columnApi.setColumnsVisible(columnsToShow, true);
        // params.columnApi.setColumnsVisible(columnsToHide, true);
        params.api.sizeColumnsToFit();
    }
    //
} // end class


