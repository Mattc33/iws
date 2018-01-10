import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi } from 'ag-grid';

import { AddRateCardDialogComponent } from './dialog/add-rate-cards/add-rate-cards-dialog.component';
import { DeleteRateCardsDialogComponent } from './dialog/delete-rate-cards/delete-rate-cards-dialog.component';
import { UploadRatesDialogComponent } from './dialog/upload-rates/upload-rates-dialog.component';

import { RateCardsService } from '../services/rate-cards.api.service';
import { RateCardsSharedService } from '../services/rate-cards.shared.service';

@Component({
    selector: 'app-rate-cards-table',
    templateUrl: './rate-cards-table.component.html',
    styleUrls: ['./rate-cards-table.component.scss'],
    providers: [ RateCardsService ],
})
export class RateCardsTableComponent implements OnInit {

    // Define row and column data
    private rowData;
    private columnDefs;

    // AG grid props
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // Properties for internal service
    private rowSelection;
    private rowID: number;

    constructor(private rateCardsService: RateCardsService, private rateCardsSharedService: RateCardsSharedService,
    private dialog: MatDialog) {
        this.columnDefs = this.createColumnDefs();
        this.rowSelection = 'single';
    }

    ngOnInit() {
        this.on_InitializeRows();
        this.rateCardsSharedService.currentRowID.subscribe( giveRowID => this.rowID = giveRowID );
    }

    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    }

    on_InitializeRows(): void {
        this.rateCardsService.get_RateCard()
        .subscribe(
            data => { this.rowData = data; },
            error => { console.log(error); }
        );
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Carrier', field: 'carrier_name',
            },
            {
                headerName: 'Rate Card', field: 'name',
                editable: true
            },
            {
                headerName: 'Start Time', field: 'start_ts',
            },
            {
                headerName: 'End Time', field: 'end_ts',
            },
            {
                headerName: 'Last Edited Time', field: 'add_ts',
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

    // On row selection pass rowID property to RateCardsTableService
    on_SelectionChanged() {
        const selectedRows = this.gridApi.getSelectedRows();
        this.rowID = selectedRows[0].id;
        console.log('id of row selected ---> ' + this.rowID);
    }

    aggrid_delRow(boolean) {
        if (boolean === true) {
            this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
        } else {
            return;
        }
    }

    aggrid_onCellValueChanged(params: any) {
        const id = params.data.id;
        const rateCardObj = {
            name: params.data.name,
            carrier_id: params.data.carrier_id
        };

        this.put_editRateCard(rateCardObj, id);
    }

    // call service to edit Rate Cards name
    put_editRateCard(rateCardObj, id) {
        this.rateCardsService.put_EditRateCard(rateCardObj, id)
        .subscribe(resp => console.log(resp));
    }

    openDialogAdd() {
        const dialogRef = this.dialog.open(AddRateCardDialogComponent, {});

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
        this.rateCardsSharedService.changeRowID(this.rowID);

        const dialogRef = this.dialog.open(DeleteRateCardsDialogComponent, {});

        const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
            // do something with event data
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            // sub.unsubscribe();
            console.log('The dialog was closed');
        });
    } // end openDialogAdd UploadRatesDialog

    openDialogUpload() {
        const dialogRef = this.dialog.open(UploadRatesDialogComponent, {});

        // const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
        //     // do something with event data
        //     this.aggrid_delRow(data);
        // });

        dialogRef.afterClosed().subscribe(() => {
            // sub.unsubscribe();
            console.log('The dialog was closed');
        });
    } // end openDialogAdd UploadRatesDialog

}
