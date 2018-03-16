import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi } from 'ag-grid';

import { DeleteTrunksComponent } from './dialog/delete-trunks/delete-trunks.component';
import { AddTrunksComponent } from './dialog/add-trunks/add-trunks.component';

import { TrunksService } from '../services/trunks.api.service';
import { TrunksSharedService } from './../services/trunks.shared.service';

@Component({
  selector: 'app-trunks-table',
  templateUrl: './trunks-table.component.html',
  styleUrls: ['./trunks-table.component.scss']
})
export class TrunksTableComponent implements OnInit {

    // AG grid
    private rowData;
    private columnDefs;
    private rowSelection;
    private quickSearchValue = '';

    // AG grid controllers
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // Props for button toggle
    private buttonToggleBoolean = true;
    private gridSelectionStatus: number;

    // Properties for internal service
    private rowObj: object;

    constructor(
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private trunksService: TrunksService,
        private trunksSharedService: TrunksSharedService,
    ) {
        this.rowSelection = 'multiple';
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_allTrunksData();
    }

    /*
        ~~~~~~~~~~ Trunks API services ~~~~~~~~~~
    */
    get_allTrunksData(): void {
        this.trunksService.get_allTrunks()
            .subscribe(
                data => { this.rowData = data; },
                error => { console.log(error); }
            );
    }

    put_editTrunks(trunkId: number, body): void {
        this.trunksService.put_editTrunk(trunkId, body)
            .subscribe(resp => console.log(resp));
    }

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs(): object {
        return [
            {
                headerName: 'Trunk Name', field: 'trunk_name',
                editable: true, checkboxSelection: true
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                editable: true,
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
                editable: true,
            },
            {
                headerName: 'Transport Method', field: 'transport', editable: true,
                cellEditor: 'select', cellEditorParams: {values: ['udp','tcp', 'both']}
            },
            {
                headerName: 'Direction', field: 'direction', editable: true,
                cellEditor: 'select', cellEditorParams: {values: ['inbound', 'outbound']}
            },
            {
                headerName: 'Prefix', field: 'prefix',
                editable: true,
            },
            {
                headerName: 'Active?', field: 'active', editable: true,
                valueFormatter: function(params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: {values: [true, false]}
            },
            {
                headerName: 'Metadata', field: 'metadata',
                editable: true,
            }
        ];
    }

    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
    aggrid_gridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

    aggrid_selectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows();
        this.rowObj = selectedRows;
    }

    aggrid_delRow(boolean): void {
        if (boolean === true) {
            this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
        } else {
            return;
        }
    }

    aggrid_addRow(obj): void {
        this.gridApi.updateRowData({ add: [obj] });
    }

    aggrid_onCellValueChanged(params: any) {
        const id = params.data.id;
        let active: boolean;
        if ( params.data.active === 1 || params.data.active === 'true' ) {
            active = true;
        }
        if ( params.data.active === 0 || params.data.active === 'false') {
            active = false;
        }
        const trunkObj = {
            carrier_id: params.data.carrier_id,
            trunk_name: params.data.trunk_name,
            trunk_ip: params.data.trunk_ip,
            trunk_port: params.data.trunk_port,
            transport: params.data.transport,
            direction: params.data.direction,
            prefix: params.data.prefix,
            active: active,
            metadata: params.data.metadata
        };

        this.put_editTrunks(id, trunkObj);
    }

    /*
        ~~~~~~~~~~ Button Toggle ~~~~~~~~~~
    */
    rowSelected(params) {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    }

    toggleButtonStates() {
        if ( this.gridSelectionStatus > 0 ) {
            this.buttonToggleBoolean = false;
        } else {
            this.buttonToggleBoolean = true;
        }
        return this.buttonToggleBoolean;
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    openDialogDel(): void {
        // assign new rowID prop
        this.trunksSharedService.changeRowObj(this.rowObj);

        const dialogRef = this.dialog.open(DeleteTrunksComponent, {});

        const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    }

    openDialogAddTrunks(): void {
        const dialogRef = this.dialog.open(AddTrunksComponent, {
            height: 'auto',
            width: '30%',
        });

        const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
            this.aggrid_addRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    }

}
