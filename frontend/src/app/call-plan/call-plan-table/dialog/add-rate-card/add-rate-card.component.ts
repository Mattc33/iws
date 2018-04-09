import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnApi, GridApi } from 'ag-grid';

import { CallPlanTableComponent } from './../../../call-plan-table/call-plan-table.component';

import { NestedAgGridService } from './../../../../global-service/nestedAgGrid.shared.service';
import { CallPlanService } from '../../../services/call-plan.api.service';
import { CallPlanSharedService } from './../../../services/call-plan.shared.service';
import { RateCardsService } from './../../../../rate-cards/services/rate-cards.api.service';
import { SnackbarSharedService } from './../../../../global-service/snackbar.shared.service';

@Component({
  selector: 'app-add-rate-card',
  templateUrl: './add-rate-card.component.html',
  styleUrls: ['./add-rate-card.component.scss']
})
export class AddRateCardComponent implements OnInit {

    // AG grid setup props
    private rowData;
    private columnDefs;
    private getNodeChildDetails;
    private rowDataReview;
    private columnDefsReview;

    // AG grid API props
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private gridApiDetails: GridApi;
    private columnApiDetails: ColumnApi;

    // AG grid UI props
    private rowSelection;
    private currentSliderValue;

    // UI Props
    private buttonToggleBoolean = true;
    private gridSelectionStatus: number;

    // Internal Service Props
    private currentRowId;

    constructor(
        public dialogRef: MatDialogRef<CallPlanTableComponent>,
        @Inject(MAT_DIALOG_DATA) public callplanTitle,
        private callPlanService: CallPlanService,
        private callPlanSharedService: CallPlanSharedService,
        private rateCardsService: RateCardsService,
        private nestedAgGridService: NestedAgGridService,
        private snackbarSharedService: SnackbarSharedService
    ) {
        this.getNodeChildDetails = this.setGroups();
        this.columnDefs = this.createColumnDefs();
        this.columnDefsReview = this.createColumnDefsReview();
    }

    ngOnInit() {
        this.get_RateCards();
        this.callPlanSharedService.currentRowAll.subscribe(data => this.currentRowId = data);
    }

    /*
        ~~~~~~~~~~ Call API services ~~~~~~~~~~
    */
    get_RateCards(): void {
        this.rateCardsService.get_RateCard().subscribe(
            data => {
                this.rowData = this.nestedAgGridService.formatDataToNestedArr(data);
            },
            error => { console.log(error); },
        );
    }

    post_attachRateCard(): void {
        const callplanId = this.currentRowId;
        const selectedRows = this.gridApi.getSelectedRows();
        for (let i = 0; i < selectedRows.length; i++) {
            const ratecardId = selectedRows[i].id;
            const body = {
                priority: selectedRows[i].priority
            };

            this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
                .subscribe(
                    (resp: Response) => {
                        console.log(resp);
                        if ( resp.status === 200 ) {
                            this.snackbarSharedService.snackbar_success('Ratecard attached successful.', 5000);
                        }
                    },
                    error => {
                        console.log(error);
                        this.snackbarSharedService.snackbar_error('Ratecard failed to attach.', 5000);
                    }
                );
        }
    }

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit();
        this.rowSelection = 'multiple';
    }

    on_GridReady_Review(params): void {
        this.gridApiDetails = params.api;
        this.columnApiDetails = params.columnApi;
        params.api.sizeColumnsToFit();
    }

    private setGroups() {
        return function getNodeChildDetails(rowItem) {
            if (rowItem.children) {
                return {
                    group: true,
                    children: rowItem.children,
                    key: rowItem.ratecard_bundle
                };
            } else {
                return null;
            }
        };
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Ratecard Group', field: 'ratecard_bundle', checkboxSelection: true,
                cellRenderer: 'agGroupCellRenderer', width: 300
            },
            {
                headerName: 'Country', field: 'country'
            },
            {
                headerName: 'Carrier', field: 'carrier_name'
            },
            {
                headerName: 'Priority', field: 'priority', hide: true,
            }
        ];
    }

    private createColumnDefsReview() {
        return [
            {
                headerName: 'ID', field: 'id',
            },
            {
                headerName: 'Ratecard Name', field: 'ratecard_bundle',
            },
            {
                headerName: 'Country', field: 'country'
            },
            {
                headerName: 'Offer', field: 'offer'
            },
            {
                headerName: 'Carrier', field: 'carrier_name'
            },
            {
                headerName: 'Priority', field: 'priority', editable: true
            }
        ];
    }

    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    aggrid_gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    onSelectionChanged() {
        this.gridApiDetails.setRowData([]);
        const selectedRow = this.gridApi.getSelectedRows();
        this.gridApiDetails.setRowData(selectedRow);
    }

    deselectAll() {
        this.gridApi.deselectAll();
    }

    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
    handleSliderChange(params) {
        const currentSliderValue = params.value;
        this.currentSliderValue = currentSliderValue;
        this.updateDetailGridData(currentSliderValue);
    }

    updateDetailGridData(currentSliderValue) {
        const itemsToUpdate = [];
        this.gridApiDetails.forEachNodeAfterFilterAndSort(function(rowNode) {
            const data = rowNode.data;
            data.priority = currentSliderValue;
            itemsToUpdate.push(data);
        });

        this.gridApiDetails.updateRowData({update: itemsToUpdate });
        this.gridApi.updateRowData({update: itemsToUpdate});
    }

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

    click_attachRatecard(): void { // trigger on submit click
        this.post_attachRateCard();
        this.closeDialog();
    }

    closeDialog(): void { // close dialog
        this.dialogRef.close();
    }
}
