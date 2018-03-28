import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnApi, GridApi } from 'ag-grid';

import { RateCardsTableComponent } from './../../rate-cards-table.component';

import { RateCardsService } from '../../../services/rate-cards.api.service';
import { RateCardsSharedService } from './../../../services/rate-cards.shared.service';
import { TrunksService } from './../../../../trunks/services/trunks.api.service';
import { NestedAgGridService } from './../../../../global-service/nestedAgGrid.shared.service';

@Component({
    selector: 'app-attach-trunks-dialog',
    templateUrl: './attach-trunks-dialog.component.html',
    styleUrls: ['./attach-trunks-dialog.component.scss'],
    providers: [ RateCardsService ],
  })
export class AttachTrunksDialogComponent implements OnInit {

    event_onAdd = new EventEmitter;

    // AG grid setup props
    private rowData;
    private columnDefs;
    private getNodeChildDetails;
    private rowDataTrunk;
    private columnDefsTrunk;
    private rowDataReview;
    private columnDefsReview;

    // AG grid API props
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private gridApiTrunk: GridApi;
    private columnApiTrunk: ColumnApi;
    private gridApiReview: GridApi;
    private columnApiReview: ColumnApi;

    // AG Gri UI props
    private rowSelection;

    // Shared service props
    private ratecardsObj;
    private trunksObj;

    // props
    private finalRatecardToTrunkArr = [];

    constructor(
        public dialogRef: MatDialogRef <RateCardsTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private rateCardsService: RateCardsService,
        private rateCardsSharedService: RateCardsSharedService,
        private trunksService: TrunksService,
        private nestedAgGridService: NestedAgGridService
    ) {
        this.getNodeChildDetails = this.setGroups();
        this.columnDefs = this.createColumnDefs();
        this.columnDefsTrunk = this.createColumnsDefsTrunk();
        this.columnDefsReview = this.createColumnDefsReview();
    }

    ngOnInit() {
        this.get_ratecards();
        this.get_trunks();
        this.rateCardsSharedService.currentRowAllObj.subscribe(data => this.ratecardsObj = data );
    }

    /*
        ~~~~~~~~~~ API Service ~~~~~~~~~~
    */
    get_ratecards(): void {
        this.rateCardsService.get_RateCard().subscribe(
            data => {
                this.rowData = this.nestedAgGridService.formatDataToNestedArr(data);
            },
            error => { console.log(error); },
        );
    }

    get_trunks(): void {
        this.trunksService.get_allTrunks().subscribe(
            data => {
                this.rowDataTrunk = data;
            },
            error => { console.log(error); },
        );
    }

    post_attachTrunksToRatecard(ratecardId: number, trunkId: number): void {
        this.rateCardsService.post_AttachTrunk(ratecardId, trunkId)
            .subscribe(resp => console.log(resp));
    }

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.ColumnApi;
        params.api.sizeColumnsToFit();
        this.rowSelection = 'multiple';
    }

    on_GridReady_trunk(params): void {
        this.gridApiTrunk = params.api;
        this.columnApiTrunk = params.ColumnApi;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_review(params): void {
        this.gridApiReview = params.api;
        this.columnApiReview = params.ColumnApi;
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
                cellRenderer: 'agGroupCellRenderer', width: 300,
            },
            {
                headerName: 'Country', field: 'country',
            },
            {
                headerName: 'Offer', field: 'offer',
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
            },
            {
                headerName: 'Priority', field: 'priority', hide: true,
            }
        ];
    }

    private createColumnsDefsTrunk() {
        return [
            {
                headerName: 'Choose Trunk to Add', field: 'trunk_name', checkboxSelection: true,
            }
        ];
    }

    private createColumnDefsReview() {
        return [
            {
                headerName: 'Ratecard Name', field: 'name', checkboxSelection: true,
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
                headerName: 'Trunk Name', field: 'trunk_name'
            },
        ];
    }

    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~
    */
    onSelectionChangedTrunk(params) {
        const selectedRatecards = this.gridApi.getSelectedRows();
        const selectedTrunk = this.gridApiTrunk.getSelectedRows();

        this.gridApiReview.setRowData(this.processReviewTable(selectedRatecards, selectedTrunk));
    }

    click_deselectAll() {
        this.gridApi.deselectAll();
    }

    /*
        ~~~~~~~~~~ Data Processing ~~~~~~~~~~
    */
    processReviewTable(selectedRatecards: any, selectedTrunk: any): Array<[{}]> {
        const reviewData = [];
        for ( let i = 0; i < selectedRatecards.length; i++) {
            reviewData.push(
                {
                    ratecard_id: selectedRatecards[i].id,
                    name: selectedRatecards[i].name,
                    country: selectedRatecards[i].country,
                    offer: selectedRatecards[i].offer,
                    carrier_name: selectedRatecards[i].carrier_name,
                    trunk_name: selectedTrunk[0].trunk_name,
                    cx_trunk_id: selectedTrunk[0].cx_trunk_id
                },
            );
        }
        return reviewData;
    }

    processReviewTableToSubmit() {
        const finalRatecardToTrunkArr = [];
        this.gridApiReview.forEachNodeAfterFilterAndSort( function(rowNode) {
            finalRatecardToTrunkArr.push(
                {
                    ratecard_id: rowNode.data.ratecard_id,
                    trunk_id: rowNode.data.cx_trunk_id
                },
            );
        });

        for ( let i = 0; i < finalRatecardToTrunkArr.length; i++ ) {
            this.post_attachTrunksToRatecard(finalRatecardToTrunkArr[i].ratecard_id, finalRatecardToTrunkArr[i].trunk_id);
        }
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    click_attachTrunks(): void {
        this.processReviewTableToSubmit();

        this.gridApiTrunk.deselectAll();
        this.gridApiReview.setRowData([]);
    }

    closeDialog(): void { // close dialog
        this.dialogRef.close();
    }

}

