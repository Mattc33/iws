import { Component, ViewChild } from '@angular/core';
import { CarrierAggridService } from './../services/carrier.service';

import {GridOptions} from 'ag-grid';

@Component({
  selector: 'app-carrier-aggrid-table',
  templateUrl: './carrier-aggrid-table.component.html',
  styleUrls: ['./carrier-aggrid-table.component.scss'],
  providers: [ CarrierAggridService ],
})

export class CarrierAggridTableComponent {
  private gridApi;
  private gridOptions: GridOptions;
  private initialRowDataLoad$;
  private rowDataUpdates$;

  constructor(carrierAggridService: CarrierAggridService ) {
    this.initialRowDataLoad$ = carrierAggridService.initialLoad();
    this.rowDataUpdates$ = carrierAggridService.byRowupdates();

    this.gridOptions = <GridOptions> {
      // Grid Options here
      enableSorting: true,
      enableFilter: true,
      enableColResize: true,
      singleClickEdit: true,
      columnDefs: this.createColumnDefs(),
      getRowNodeId: function (data) {
          // the code is unique, so perfect for the id
          return data.code;
      },
      onGridReady: () => {
        this.initialRowDataLoad$.subscribe(
            rowData => {
                // the initial full set of data
                // note that we don't need to un-subscribe here as it's a one off data load
                if (this.gridOptions.api) { // can be null when tabbing between the examples
                    this.gridOptions.api.setRowData(rowData);
                }

                // now listen for updates
                // we process the updates with a transaction - this ensures that only the changes
                // rows will get re-rendered, improving performance
                this.rowDataUpdates$.subscribe((updates) => {
                    if (this.gridOptions.api) { // can be null when tabbing between the examples
                        this.gridOptions.api.updateRowData({update: updates});
                    }
                });
            }
        );
        this.gridOptions.api.sizeColumnsToFit();
    }
  };

  private createColumnDefs() {
    return [
        // ID
        {
            headerName: 'Id', field: 'id', width: 100,
        },
        // Date
        {
            headerName: 'Date', field: 'date', width: 150,
        },
        // Name
        {
            headerName: 'Name', field: 'name', width: 100,
            editable: true
        },
        // Phone Number
        {
            headerName: 'Phone Number', field: 'phone_number', width: 150,
            editable: true
        },
        // Taxable
        {
            headerName: 'Taxable', field: 'taxable', width: 150,
            editable: true
        },
        // Tier Number
        {
            headerName: 'Tier Number', field: 'tier_number', width: 150,
            editable: true
        },
        // Two Digit Code
        {
            headerName: 'Two Digit Code', field: 'two_digit_unique_code', width: 180,
            editable: true
        },
    ];
  }
}
