import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GridApi } from 'ag-grid';

import { DeleteTrunksComponent } from './dialog/delete-trunks/delete-trunks.component';
import { AddTrunksComponent } from './dialog/add-trunks/add-trunks.component';

import { TrunksService } from './../../shared/api-services/trunk/trunks.api.service';
import { TrunksSharedService } from './../../shared/services/trunk/trunks.shared.service';
import { ToggleButtonStateService } from './../../shared/services/global/buttonStates.shared.service';
import { SnackbarSharedService } from './../../shared/services/global/snackbar.shared.service';

@Component({
  selector: 'app-trunks-table',
  templateUrl: './trunks-table.component.html',
  styleUrls: ['./trunks-table.component.scss']
})
export class TrunksTableComponent implements OnInit {

    // AG grid
    private rowData;
    private columnDefs;
    private rowSelection = 'multiple';
    private quickSearchValue = '';

    // AG grid controllers
    private gridApi: GridApi;

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
        private toggleButtonStateService: ToggleButtonStateService,
        private snackbarSharedService: SnackbarSharedService
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_TrunkData();
    }

    // ================================================================================
    // Trunk API Service
    // ================================================================================
    get_TrunkData(): void {
        this.trunksService.get_allTrunks()
            .subscribe(
                data => { this.rowData = data; },
                error => { console.log(error); }
            );
    }

    set_TrunkData(): void {
        this.trunksService.get_allTrunks()
            .subscribe(
                data => { this.gridApi.setRowData(data); },
                error => { console.log(error); }
            );
    }

    put_editTrunks(trunkId: number, body): void {
        this.trunksService.put_editTrunk(trunkId, body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
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
    onGridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    createColumnDefs(): object {
        return [
            {
                headerName: 'Trunk Name', field: 'trunk_name',
                editable: true, checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Transport Method', field: 'transport', editable: true,
                cellEditor: 'select', cellEditorParams: {values: ['udp', 'tcp', 'both']},
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Direction', field: 'direction', editable: true,
                cellEditor: 'select', cellEditorParams: {values: ['inbound', 'outbound']},
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Prefix', field: 'prefix',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active?', field: 'active', editable: true,
                valueFormatter: function(params) {
                    if (params.value === 1) { return true; }
                    if (params.value === 0) { return false; }
                },
                cellEditor: 'select', cellEditorParams: {values: [true, false]},
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Metadata', field: 'metadata',
                editable: true,
            }
        ];
    }

    // ================================================================================
    // AG Grid UI
    // ================================================================================
    onGridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

    onSelectionChanged(): void {
        this.rowObj = this.gridApi.getSelectedRows();
    }

    aggrid_onCellValueChanged(params: any) {
        const id = params.data.id;
        let active: boolean;
        if ( params.data.active === 1 || params.data.active === 'true' ) { active = true; }
        if ( params.data.active === 0 || params.data.active === 'false') { active = false; }
        const trunkObj = {
            carrier_id: params.data.carrier_id,
            trunk_name: params.data.trunk_name,
            trunk_ip: params.data.trunk_ip,
            trunk_port: parseInt(params.data.trunk_port, 0),
            transport: params.data.transport,
            direction: params.data.direction,
            prefix: params.data.prefix,
            active: active,
            metadata: params.data.metadata
        };
        this.put_editTrunks(id, trunkObj);
    }

    onQuickFilterChanged() {
        this.gridApi.setQuickFilter(this.quickSearchValue);
    }

    // ================================================================================
    // Button Toggle
    // ================================================================================
    rowSelected(params) {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    }

    toggleButtonStates(): boolean {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    }

    // ================================================================================
    // Dialog
    // ================================================================================
    openDialogDel(): void {
        this.trunksSharedService.changeRowObj(this.rowObj);

        const dialogRef = this.dialog.open(DeleteTrunksComponent, {});

        dialogRef.afterClosed().subscribe(() => {
            this.set_TrunkData();
        });
    }

    openDialogAddTrunks(): void {
        const dialogRef = this.dialog.open(AddTrunksComponent, {
            height: 'auto',
            width: '50%',
        });

        dialogRef.afterClosed().subscribe(() => {

        });
    }

}
