import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarrierService } from '../services/carrier.service';
import { TableService } from './../services/table.service';

import { GridOptions, GridApi } from 'ag-grid';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-carrier-table',
  templateUrl: './carrier-table.component.html',
  styleUrls: ['./carrier-table.component.scss'],
  providers: [ CarrierService ],
  // turn off encapsulated view so custom styles can be applied to ag-grid component
  encapsulation: ViewEncapsulation.None
})

export class CarrierTableComponent implements OnInit {

    // row data and column definitions
    private rowData;
    private columnDefs;
    private rowSelection;

    // gridApi and columnApi
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // passData
    rowID: number;
    ifDialog: number;

    carrierObj: {};

    // inject your service
    constructor( private carrierService: CarrierService, private tableService: TableService, private cd: ChangeDetectorRef ) {
        this.columnDefs = this.createColumnDefs();
        this.rowSelection = 'single';
    }

    // On ngOnInit lifecycle hook set local var rowID to the value from the observable currentRowID
    ngOnInit() {
        // Pass row id from row selection to delete dialog
        this.tableService.currentRowID.subscribe( receivedRowID => this.rowID = receivedRowID );

        // subscribe to the response from delete dialog, if changeDetection call method to del row
        this.tableService.currentIfDialog.subscribe( receivedIfDialog => {
            this.ifDialog = receivedIfDialog;
            this.cd.markForCheck(); {
                this.on_RemoveRowOnDialogComfirm();
            }
        });

        // subcsribe to response from add dialog, if changeDetection call method to add row
        this.tableService.currentCarrierObj.subscribe( receivedCarrierObj => {
            this.carrierObj = receivedCarrierObj;
            this.cd.markForCheck(); {
                this.on_AddRow();
            }
        });

    }

    // on grid initialisation, grap the APIs and auto resize the columns to fit the available space
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.carrierService.initialLoad()
        .subscribe(
            data => { this.rowData = data; params.api.setRowData(data); },
            error => { console.log(error); }
        );
        this.gridApi.sizeColumnsToFit();
    }

    // create column definitions
    private createColumnDefs() {
        return [
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
                editable: true,
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
    on_GridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    // On row selection pass rowID property to TableService
    on_SelectionChanged() {
        const selectedRows = this.gridApi.getSelectedRows();
        this.rowID = selectedRows[0].carrier_id;
        console.log(this.rowID);

        this.tableService.changeRowID( this.rowID );
    }

    on_RemoveRowOnDialogComfirm() {
        // If dialog yes is clicked ifDialog is now = 1 from table service, then call ag grid delete row method
        if ( this.ifDialog === 1 ) {
            this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
        } else {
            return;
        }
    }

    on_AddRow() {
        const addCarrierToRow = {
            two_digit_unique_code: this.carrierObj['code'],
            carrier_name: this.carrierObj['name'],
            email: this.carrierObj['email'],
            phone_number: this.carrierObj['phone'],
            address: this.carrierObj['address'],
            taxable: this.carrierObj['taxable'],
            tier_number: this.carrierObj['tier']
        };

        if ( this.carrierObj['name'] !== '' ) {
            this.gridApi.updateRowData({ add: [addCarrierToRow] });
        } else {
            return;
        }
    }

    on_CellValueChanged(params: any) {
        const row_carrierObj = {
            code: params.data.two_digit_unique_code,
            name: params.data.carrier_name,
            email: params.data.email,
            phone: params.data.phone_number,
            address: params.data.address,
            taxable: params.data.taxable,
            tier: params.data.tier_number,
            carrier_id: params.data.carrier_id,
          };

        this.carrierService.putEditField(row_carrierObj)
            .subscribe(result => console.log(result));
    }

} // end class
