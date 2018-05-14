import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { GridApi } from 'ag-grid';

import { RateCardsService } from './../../shared/api-services/ratecard/rate-cards.api.service';
import { RateCardsSharedService } from './../../shared/services/ratecard/rate-cards.shared.service';
import { TrunksService } from './../../trunks/services/trunks.api.service';
import { NestedAgGridService } from './../../shared/services/global/nestedAgGrid.shared.service';
import { SnackbarSharedService } from './../../shared/services/global/snackbar.shared.service';

@Component({
  selector: 'app-rate-cards-add-trunks',
  templateUrl: './rate-cards-add-trunks.component.html',
  styleUrls: ['./rate-cards-add-trunks.component.scss']
})
export class RateCardsAddTrunksComponent implements OnInit {

    public event_onAdd = new EventEmitter;

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
    private gridApiTrunk: GridApi;
    private gridApiReview: GridApi;

    // AG Gri UI props
    private rowSelection;

    // Shared service props
    private ratecardsObj;
    private trunksObj;

    // props
    private finalRatecardToTrunkArr = [];

    constructor(
        private rateCardsService: RateCardsService,
        private rateCardsSharedService: RateCardsSharedService,
        private trunksService: TrunksService,
        private nestedAgGridService: NestedAgGridService,
        private snackbarSharedService: SnackbarSharedService
    ) {
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefs = this.createColumnDefs();
        this.columnDefsTrunk = this.createColumnsDefsTrunk();
        this.columnDefsReview = this.createColumnDefsReview();
    }

    ngOnInit() {
        this.get_ratecards();
        this.get_trunks();
        this.rateCardsSharedService.currentRowAllObj.subscribe(data => this.ratecardsObj = data );
    }

    // ================================================================================
    // API Service
    // ================================================================================
    get_ratecards(): void {
        this.rateCardsService.get_ratecard().subscribe(
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
            .subscribe((resp: Response) => {
                    console.log(resp.status);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Trunk Successfully attached to Ratecard.', 5000);
                    } else {
                    }
                }
            );
    }

    // ================================================================================
    // AG Grid Init
    // ================================================================================
    on_GridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
        this.rowSelection = 'multiple';
    }

    on_GridReady_trunk(params): void {
        this.gridApiTrunk = params.api;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_review(params): void {
        this.gridApiReview = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Ratecard Group', field: 'ratecard_bundle', checkboxSelection: true,
                cellRenderer: 'agGroupCellRenderer', width: 300,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country', width: 120,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name', width: 80,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Priority', field: 'priority', hide: true,
            }
        ];
    }

    private createColumnsDefsTrunk() {
        return [
            {
                headerName: 'Choose Trunk', field: 'trunk_name', checkboxSelection: true,
            }
        ];
    }

    private createColumnDefsReview() {
        return [
            {
                headerName: 'Ratecard Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Name', field: 'trunk_name',
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
        this.gridApiTrunk.deselectAll();
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
                    trunk_id: selectedTrunk[0].id
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
                    trunk_id: rowNode.data.trunk_id
                },
            );
        });

        console.log(finalRatecardToTrunkArr);

        for ( let i = 0; i < finalRatecardToTrunkArr.length; i++ ) {
            this.post_attachTrunksToRatecard(finalRatecardToTrunkArr[i].ratecard_id, finalRatecardToTrunkArr[i].trunk_id);
        }
    }

    click_attachTrunks(): void {
        this.processReviewTableToSubmit();

        this.gridApiTrunk.deselectAll();
        this.gridApiReview.setRowData([]);
    }

}

