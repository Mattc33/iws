import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi } from 'ag-grid';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';

import { DelCarrierDialogComponent } from '../carrier-table/dialog/del-carrier/del-carrier-dialog.component';
import { AddCarrierDialogComponent } from '../carrier-table/dialog/add-carrier/add-carrier-dialog.component';

import { CarrierService } from './../services/carrier.api.service';
import { CarrierSharedService } from './../services/carrier.shared.service';


@Component({
  selector: 'app-carrier-table',
  templateUrl: './carrier-table.component.html',
  styleUrls: ['./carrier-table.component.scss'],
  providers: [ CarrierService ],
})

export class CarrierTableComponent implements OnInit {

    // row data and column definitions
    private rowData;
    private columnDefs;
    private rowSelection;

    // gridApi and columnApi
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // pass Data using shared service
    private rowObj;
    private quickSearchValue: string = '';

    // inject your service
    constructor( private carrierService: CarrierService, private carrierSharedService: CarrierSharedService,
    private dialog: MatDialog) {
        this.columnDefs = this.createColumnDefs();
        this.rowSelection = 'single';
    }

    ngOnInit() {
        // set initial row data
        this.get_InitializeRows();
        this.carrierSharedService.currentRowObj.subscribe( giveRowObj => this.rowObj = giveRowObj);
    }

    get_InitializeRows() {
        this.carrierService.get_carriers()
        .subscribe(
            data =>  this.rowData = data,
            error =>  console.log(error)
        );
    }

    // on grid initialisation, grap the APIs and auto resize the columns to fit the available space
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    }

    // create column definitions
    private createColumnDefs() {
        return [
            // Name
            {
                headerName: 'Name', field: 'name',
                editable: true, checkboxSelection: true, 
            },
            // Phone Number
            {
                headerName: 'Phone Number', field: 'phone',
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
                width: 300,
                editable: true
            },
            // Taxable
            {
                headerName: 'Taxable', field: 'taxable', editable: true, 
                cellEditor: 'select', cellEditorParams: {values: [ "true", "false"]}
            },
            // Tier Number
            {
                headerName: 'Tier Number', field: 'tier', editable: true,
                cellEditor: 'select', cellEditorParams: {values: [ 1, 2, 3, 4, 5]}
            },
            // Three Digit Code
            {
                headerName: 'Carrier Code', field: 'code',
                editable: true
            },
        ];
    }

    // When width of parent (e) has been changed, fire this event to resize col
    on_GridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    aggrid_addRow(obj) {
        this.gridApi.updateRowData({ add: [obj] });
    }

    // On row selection pass rowID property to TableService
    on_SelectionChanged() {
        const selectedRows = this.gridApi.getSelectedRows();
        this.rowObj = selectedRows;
        console.log(this.rowObj);
    }

    aggrid_delRow(boolean) {
        if (boolean === true) {
            this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
        } else {
            return;
        }
    }

    // When cell edit event closes call update
    aggrid_onCellValueChanged(params: any) {
        const id = params.data.id;
        let taxable = params.data.taxable;
            if (taxable === 'false') {
                taxable = false;
            } else {
                taxable = true;
            }
        const carrierObj = {
            code: params.data.code,
            name: params.data.name,
            email: params.data.email,
            phone: params.data.phone,
            address: params.data.address,
            taxable: taxable,
            tier: parseInt(params.data.tier),
          };

        this.carrierService.put_EditCarrier(carrierObj, id)
        .subscribe(resp => console.log(resp));
    }

    put_editCarrier(carrierObj, id) {
        this.carrierService.put_EditCarrier(carrierObj, id)
            .subscribe(resp => console.log(resp));
    }

    openDialogAdd() {
        const dialogRef = this.dialog.open(AddCarrierDialogComponent, {
            height: 'auto',
            width: '30%',
        });

        const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
            // do something with event data
            this.aggrid_addRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    } // end openDialogAdd UploadRatesDialog

    openDialogDel() {
        // assign new rowID prop
        this.carrierSharedService.changeRowObj(this.rowObj);

        const dialogRef = this.dialog.open(DelCarrierDialogComponent, {});

        const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
            // do something with event data
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    } // end openDialogAdd UploadRatesDialog

    onQuickFilterChanged() { // external global search
        this.gridApi.setQuickFilter(this.quickSearchValue);
    }

} // end class
