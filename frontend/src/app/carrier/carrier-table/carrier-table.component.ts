import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi } from 'ag-grid';

import { DelCarrierDialogComponent } from '../carrier-table/dialog/del-carrier/del-carrier-dialog.component';
import { AddCarrierDialogComponent } from '../carrier-table/dialog/add-carrier/add-carrier-dialog.component';

import { CarrierService } from './../../shared/api-services/carrier/carrier.api.service';
import { CarrierSharedService } from './../../shared/services/carrier/carrier.shared.service';
import { SnackbarSharedService } from './../../shared/services/global/snackbar.shared.service';
import { ToggleButtonStateService } from './../../shared/services/global/buttonStates.shared.service';

@Component({
  selector: 'app-carrier-table',
  templateUrl: './carrier-table.component.html',
  styleUrls: ['./carrier-table.component.scss']
})
export class CarrierTableComponent implements OnInit {

    // row data and column definitions
    private rowData;
    private columnDefs;

    // gridApi & gridUI props
    private gridApi: GridApi;
    private quickSearchValue = '';
    private rowSelection = 'single';

    // Internal Service
    private rowObj;

    // UI Props
    private gridSelectionStatus: number;

    constructor( // inject your service
        private carrierService: CarrierService,
        private carrierSharedService: CarrierSharedService,
        private _dialog: MatDialog,
        private snackbarSharedService: SnackbarSharedService,
        private toggleButtonStateService: ToggleButtonStateService
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_carrierRowData();
        this.carrierSharedService.currentRowObj.subscribe( giveRowObj => this.rowObj = giveRowObj);
    }

    // ================================================================================
    // Carrier API Service
    // ================================================================================
    get_carrierRowData() {
        this.carrierService.get_carriers().subscribe(
            data =>  this.rowData = data,
            error =>  console.log(error)
        );
    }

    put_editCarrier(carrierObj, id) {
        this.carrierService.put_EditCarrier(carrierObj, id)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
                }
            );
    }

    // ================================================================================
    // AG Grid Init
    // ================================================================================
    on_GridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Name', field: 'name',
                editable: true, checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Phone Number', field: 'phone',
                editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Email', field: 'email',
                editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Address', field: 'address',
                width: 400, editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Taxable', field: 'taxable', editable: true,
                cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Tier Number', field: 'tier', editable: true,
                cellEditor: 'select', cellEditorParams: {values: [ 1, 2, 3, 4, 5]},
                filter: 'agNumberColumnFilter',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Code', field: 'code',
                editable: true,
            },
        ];
    }

    // ================================================================================
    // Grid UI Interactions
    // ================================================================================
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    selectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows();
        this.rowObj = selectedRows;
    }

    // ================================================================================
    // AG Grid Events
    // ================================================================================
    rowSelected(): void { // Toggle button boolean if rowSelected > 0
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    }

    toggleButtonStates(): boolean {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    }

    onQuickFilterChanged() { // external global search
        this.gridApi.setQuickFilter(this.quickSearchValue);
    }

    // ================================================================================
    // API Interactions
    // ================================================================================
    onRefreshRowData(): void {
        this.carrierService.get_carriers().subscribe(
            (data) => {
                this.gridApi.setRowData(data);
            }
        );
    }

    onCellValueChanged(params: any): void {
        const id = params.data.id;
        let taxable = params.data.taxable;
            if (taxable === 'false') { taxable = false;
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
            tier: parseInt(params.data.tier, 0)
        };
        this.put_editCarrier(carrierObj, id);
    }

    // ================================================================================
    // Carrier Dialog
    // ================================================================================
    openDialogAdd() {
        const dialogRef = this._dialog.open(AddCarrierDialogComponent, {
            width: '40%',
        });

        dialogRef.afterClosed().subscribe(() => {
            this.onRefreshRowData();
        });
    }

    openDialogDel() {
        this.carrierSharedService.changeRowObj(this.rowObj);

        const dialogRef = this._dialog.open(DelCarrierDialogComponent, {});

        dialogRef.afterClosed().subscribe(() => {
            this.onRefreshRowData();
        });
    }

}
