import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi, ColumnApi } from 'ag-grid';

import { DelCarrierDialogComponent } from '../carrier-table/dialog/del-carrier/del-carrier-dialog.component';
import { AddCarrierDialogComponent } from '../carrier-table/dialog/add-carrier/add-carrier-dialog.component';

import { CarrierService } from './../services/carrier.api.service';
import { CarrierSharedService } from './../services/carrier.shared.service';
import { SnackbarSharedService } from './../../global-service/snackbar.shared.service';

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
    private quickSearchValue = '';

    // gridApi and columnApi
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // pass Data using shared service
    private rowObj;

    // UI Props
    private buttonToggleBoolean = true;
    private gridSelectionStatus: number;

    constructor( // inject your service
        private carrierService: CarrierService,
        private carrierSharedService: CarrierSharedService,
        private dialog: MatDialog,
        private snackbarSharedService: SnackbarSharedService
    ) {
        this.columnDefs = this.createColumnDefs();
        this.rowSelection = 'single';
    }

    ngOnInit() {
        this.get_InitializeRows();
        this.carrierSharedService.currentRowObj.subscribe( giveRowObj => this.rowObj = giveRowObj);
    }

    /*
        ~~~~~~~~~~ Carrier API services ~~~~~~~~~~
    */
    get_InitializeRows() {
        this.carrierService.get_carriers()
        .subscribe(
            data =>  this.rowData = data,
            error =>  console.log(error)
        );
    }

    put_editCarrier(carrierObj, id) {
        this.carrierService.put_EditCarrier(carrierObj, id)
            .subscribe(resp => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Edit Successful.', 5000);
                    } else {

                    }
                }
            );
    }

    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Name', field: 'name',
                editable: true, checkboxSelection: true,
            },
            {
                headerName: 'Phone Number', field: 'phone',
                editable: true
            },
            {
                headerName: 'Email', field: 'email',
                editable: true
            },
            {
                headerName: 'Address', field: 'address',
                width: 400,
                editable: true
            },
            {
                headerName: 'Taxable', field: 'taxable', editable: true,
                cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
            },
            {
                headerName: 'Tier Number', field: 'tier', editable: true,
                cellEditor: 'select', cellEditorParams: {values: [ 1, 2, 3, 4, 5]},
                filter: 'agNumberColumnFilter'
            },
            {
                headerName: 'Carrier Code', field: 'code',
                editable: true
            },
        ];
    }

    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    selectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows();
        this.rowObj = selectedRows;
    }

    /*
        ~~~~~~~~~~ Grid Toolbar ~~~~~~~~~~
    */
    rowSelected(): void { // Toggle button boolean if rowSelected > 0
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    }

    toggleButtonStates(): boolean {
        if ( this.gridSelectionStatus > 0 ) {
          this.buttonToggleBoolean = false;
        } else {
          this.buttonToggleBoolean = true;
        }
        return this.buttonToggleBoolean;
    }

    onQuickFilterChanged() { // external global search
        this.gridApi.setQuickFilter(this.quickSearchValue);
    }

    /*
        ~~~~~~~~~~ Grid CRUD ~~~~~~~~~~
    */
    aggrid_addRow(obj): void {
        this.gridApi.updateRowData({ add: [obj] });
    }

    aggrid_delRow(boolean): void {
        if (boolean === true) {
            this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
        } else {
            return;
        }
    }

    onCellValueChanged(params: any): void {
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
        this.put_editCarrier(carrierObj, id);
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~
    */
    openDialogAdd() {
        const dialogRef = this.dialog.open(AddCarrierDialogComponent, {
            width: '40%',
        });

        const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
            this.aggrid_addRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    }

    openDialogDel() {
        this.carrierSharedService.changeRowObj(this.rowObj);

        const dialogRef = this.dialog.open(DelCarrierDialogComponent, {});

        const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    }

}
