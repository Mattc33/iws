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
    private quickSearchValue: string = '';

    // gridApi and columnApi
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // pass Data using shared service
    private rowObj;

    // UI Props
    private buttonToggleBoolean: boolean = true;
    private gridSelectionStatus: number;

    constructor( // inject your service
        private carrierService: CarrierService, 
        private carrierSharedService: CarrierSharedService,
        private dialog: MatDialog
    ) 
    {
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
            .subscribe(resp => console.log(resp));
    }

    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
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
                width: 300,
                editable: true
            },
            {
                headerName: 'Taxable', field: 'taxable', editable: true, 
                cellEditor: 'select', cellEditorParams: {values: [ "true", "false"]}
            },
            {
                headerName: 'Tier Number', field: 'tier', editable: true,
                cellEditor: 'select', cellEditorParams: {values: [ 1, 2, 3, 4, 5]},
                filter: "agNumberColumnFilter"
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
    on_GridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

    aggrid_addRow(obj): void {
        this.gridApi.updateRowData({ add: [obj] });
    }

    on_SelectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows();
        this.rowObj = selectedRows;
        console.log(this.rowObj);
    }

    aggrid_delRow(boolean): void {
        if (boolean === true) {
            this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
        } else {
            return;
        }
    }

    aggrid_rowSelected(): void {
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

    aggrid_onCellValueChanged(params: any): void {
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

    onQuickFilterChanged() { // external global search
        this.gridApi.setQuickFilter(this.quickSearchValue);
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~
    */
    openDialogAdd() {
        const dialogRef = this.dialog.open(AddCarrierDialogComponent, {
            // height: 'auto',
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
            // do something with event data
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    } 

} 
