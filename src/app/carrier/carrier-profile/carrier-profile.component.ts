import { ToggleButtonStateService } from './../../shared/services/global/buttonStates.shared.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi } from 'ag-grid';
import { SnackbarSharedService } from '../../shared/services/global/snackbar.shared.service';
import { AddCarrierProfileDialogComponent } from './dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component';
import { DelCarrierProfileDialogComponent } from './dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component';
import { CarrierProfileService } from './../../shared/api-services/carrier/carrier-profile.api.service';
import { CarrierService } from '../../shared/api-services/carrier/carrier.api.service';

@Component({
  selector: 'app-carrier-profile',
  templateUrl: './carrier-profile.component.html',
  styleUrls: ['./carrier-profile.component.scss']
})
export class CarrierProfileComponent implements OnInit {

    // * row and col definitions
    private rowData;
    private columnDefs;

    // * Grid API & Grid UI props
    private gridApi: GridApi;
    private quickSearchValue = '';
    private rowSelection = 'single';

    // Internal Service
    private rowObj;

    // UI Props
    gridSelectionStatus: number;

    constructor(
        private _dialog: MatDialog,
        private _snackbarSharedService: SnackbarSharedService,
        private _toggleButtonStateService: ToggleButtonStateService,
        private _carrierProfileService: CarrierProfileService
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_carrierProfiles();
    }

    // ================================================================================
    // Carrier Profile API
    // ================================================================================
    get_carrierProfiles() {

    }

    put_editCarrierProfiles() {

    }

    onRefreshRowData(): void { // * refresh rowData by calling and settting service data
        // this.carrierService.get_carriers().subscribe(
        //     (data) => {
        //         this.gridApi.setRowData(data);
        //     }
        // );
    }

    // ================================================================================
    // AG Grid Init
    // ================================================================================
    onGridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    createColumnDefs() {
        return [
            {
                headerName: 'Carrier Name', field: 'carrier_name'
            },
            {
                headerName: 'Carrier Code', field: 'carrier_code'
            },
            {
                headerName: 'Profile Name', field: 'profle_name'
            },
            {
                headerName: 'Rows From Top', field: 'rowsFromTop'
            },
            {
                headerName: 'Rows From Bottom', field: 'rowsFromBottom'
            },
            {
                headerName: 'Destination Column', field: 'destCol'
            },
            {
                headerName: 'Prefix Column', field: 'prefixCol'
            },
            {
                headerName: 'Rates Column', field: 'ratesCol'
            },
            {
                headerName: 'Status Column', field: 'statusCol'
            }
        ];
    }

    // ================================================================================
    // * Grid UI Interactions
    // ================================================================================
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    selectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows();
        this.rowObj = selectedRows;
    }

    // ================================================================================
    // * Carrier Profile Dialog
    // ================================================================================
    openDialogAdd() {
        const dialogRef = this._dialog.open(AddCarrierProfileDialogComponent, {
            width: '70%',
        });

        dialogRef.afterClosed().subscribe(() => {
            this.onRefreshRowData(); // * when the dialog closes call fn to refresh rowdata
        });
    }

    openDialogDel() {
        const dialogRef = this._dialog.open(DelCarrierProfileDialogComponent, {});

        dialogRef.afterClosed().subscribe(() => {
            this.onRefreshRowData(); // * when the dialog closes call fn to refresh rowdata
        });
    }

}
