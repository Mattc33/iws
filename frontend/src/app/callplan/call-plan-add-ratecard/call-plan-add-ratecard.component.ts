import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { GridApi } from 'ag-grid';

import { CallPlanService } from './../../shared/api-services/callplan/call-plan.api.service';
import { CallPlanSharedService } from '../../shared/services/callplan/call-plan.shared.service';
import { RateCardsService } from './../../shared/api-services/ratecard/rate-cards.api.service';

import { NestedAgGridService } from './../../shared/services/global/nestedAgGrid.shared.service';
import { SnackbarSharedService } from './../../shared/services/global/snackbar.shared.service';
import { ToggleButtonStateService } from './../../shared/services/global/buttonStates.shared.service';

@Component({
  selector: 'app-call-plan-add-ratecard',
  templateUrl: './call-plan-add-ratecard.component.html',
  styleUrls: ['./call-plan-add-ratecard.component.scss']
})
export class CallPlanAddRatecardComponent implements OnInit {

// AG grid setup props
private rowDataCallplan; private columnDefsCallplan;
private rowDataRatecard; private columnDefsRatecard; private getNodeChildDetails;
private rowDataReview; private columnDefsReview;

// AG grid API props
private gridApiCallPlan: GridApi;
private gridApiRatecard: GridApi;
private gridApiDetails: GridApi;

// AG grid UI props
private rowSelectionS = 'single';
private rowSelectionM = 'multiple';
private currentSliderValue;

// UI Props
private gridSelectionStatus;

constructor(
    private callPlanService: CallPlanService,
    private callPlanSharedService: CallPlanSharedService,
    private rateCardsService: RateCardsService,
    private nestedAgGridService: NestedAgGridService,
    private snackbarSharedService: SnackbarSharedService,
    private toggleButtonStateService: ToggleButtonStateService
) {
    this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
    this.columnDefsCallplan = this.createColumnDefsCallPlan();
    this.columnDefsRatecard = this.createColumnDefsRatecard();
    this.columnDefsReview = this.createColumnDefsReview();
}

ngOnInit() {
    this.get_CallPlans();
    this.get_RateCards();
}

// ================================================================================
// API Service
// ================================================================================
get_CallPlans(): void {
    this.callPlanService.get_allCallplan().subscribe(
        data => { this.rowDataCallplan = data; }
    );
}

get_RateCards(): void {
    this.rateCardsService.get_ratecard().subscribe(
        data => { this.rowDataRatecard = this.nestedAgGridService.formatDataToNestedArr(data); }
    );
}

post_attachRateCard(callplanId: number, ratecardId: number, body: any): void {
    this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
        .subscribe(
            (resp) => {
                console.log(resp);
                if ( resp.status === 200 ) {
                    this.snackbarSharedService.snackbar_success('Ratecard attached successful.', 2000);
                }
            },
            error => {
                console.log(error);
                this.snackbarSharedService.snackbar_error('Ratecard failed to attach.', 2000);
            }
        );
}

// ================================================================================
// AG Grid Init
// ================================================================================
on_GridReady_CallPlan(params): void {
    this.gridApiCallPlan = params.api;
    params.api.sizeColumnsToFit();
}

on_GridReady_Ratecard(params): void {
    this.gridApiRatecard = params.api;
    params.api.sizeColumnsToFit();
}

on_GridReady_Review(params): void {
    this.gridApiDetails = params.api;
    params.api.sizeColumnsToFit();
}

private createColumnDefsCallPlan() {
    return [
        {
            headerName: 'Call Plan', field: 'title',
            checkboxSelection: true,
        }
    ];

}

private createColumnDefsRatecard() {
    return [
        {
            headerName: 'Ratecard Group', field: 'ratecard_bundle', checkboxSelection: true,
            cellRenderer: 'agGroupCellRenderer', width: 300,
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
            headerName: 'Priority', field: 'priority', hide: true,
        }
    ];
}

private createColumnDefsReview() {
    return [
        {
            headerName: 'ID', field: 'id', width: 80,
            cellStyle: { 'border-right': '1px solid #E0E0E0' },
        },
        {
            headerName: 'Ratecard Name', field: 'name',
            cellStyle: { 'border-right': '1px solid #E0E0E0' },
        },
        {
            headerName: 'Country', field: 'country',
            cellStyle: { 'border-right': '1px solid #E0E0E0' },
        },
        {
            headerName: 'Offer', field: 'offer', width: 100,
            cellStyle: { 'border-right': '1px solid #E0E0E0' },
        },
        {
            headerName: 'Carrier', field: 'carrier_name',
            cellStyle: { 'border-right': '1px solid #E0E0E0' },
        },
        {
            headerName: 'Priority', field: 'priority', editable: true,
        }
    ];
}

// ================================================================================
// AG Grid UI events
// ================================================================================
onGridSizeChanged(params) {
    params.api.sizeColumnsToFit();
}

resetAttachRatecardForm() {
    this.gridApiCallPlan.deselectAll();
    this.gridApiRatecard.deselectAll();
    this.gridApiDetails.setRowData([]);
}

onSelectionChanged() {
    this.gridApiDetails.setRowData(this.generateDetailsRowData());
    this.gridSelectionStatus = this.generateDetailsRowData().length;
}

handleSliderChange(params) {
    const currentSliderValue = params.value;
    this.currentSliderValue = currentSliderValue;
    this.updateDetailGridData(currentSliderValue);
}

click_attachRatecard() { // trigger on submit click
    this.generateApiService();
    this.gridApiRatecard.deselectAll();
    this.gridApiDetails.setRowData([]);
}

// ================================================================================
// UI States
// ================================================================================
toggleButtonStates(): boolean {
    return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
}

updateDetailGridData(currentSliderValue) {
    const itemsToUpdate = [];
    this.gridApiDetails.forEachNodeAfterFilterAndSort(function(rowNode) {
        const data = rowNode.data;
        data.priority = currentSliderValue;
        itemsToUpdate.push(data);
    });

    this.gridApiDetails.updateRowData({update: itemsToUpdate });
}

// ================================================================================
// AG Grid Fetch Data
// ================================================================================
getSelectedCallPlanData(): any {
    return this.gridApiCallPlan.getSelectedRows();
}

getSelectedRatecardData(): any {
    return this.gridApiRatecard.getSelectedRows();
}

getSelectedDetailsData(num: string): any {
    return this.gridApiDetails.getRowNode(num);
}

generateDetailsRowData() {
    const ratecardData = this.getSelectedRatecardData();
    const detailsRowData = [];
    for ( let i = 0; i < ratecardData.length; i++) {
        detailsRowData.push(
            {
                id: ratecardData[i].id,
                name: ratecardData[i].name,
                country: ratecardData[i].country,
                offer: ratecardData[i].offer,
                carrier_name: ratecardData[i].carrier_name,
                priority: 1
            }
        );
    }
    return detailsRowData;
}

generateApiService() {
    const callplanId = this.getSelectedCallPlanData()[0].id;
    const detailTableLen = this.gridApiDetails.paginationGetRowCount();

    for ( let i = 0; i < detailTableLen; i++ ) {
        const ratecardId = this.getSelectedDetailsData(`${i}`).data.id;
        const body = { priority: this.getSelectedDetailsData(`${i}`).data.priority };
        this.post_attachRateCard(callplanId, ratecardId, body);
    }
}

}
