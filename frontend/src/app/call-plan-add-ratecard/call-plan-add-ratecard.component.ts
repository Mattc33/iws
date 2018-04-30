import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi } from 'ag-grid';

import { NestedAgGridService } from './../global-service/nestedAgGrid.shared.service';
import { CallPlanService } from './../call-plan/services/call-plan.api.service';
import { CallPlanSharedService } from './../call-plan/services/call-plan.shared.service';
import { RateCardsService } from './../rate-cards/services/rate-cards.api.service';
import { SnackbarSharedService } from './../global-service/snackbar.shared.service';


@Component({
  selector: 'app-call-plan-add-ratecard',
  templateUrl: './call-plan-add-ratecard.component.html',
  styleUrls: ['./call-plan-add-ratecard.component.scss']
})
export class CallPlanAddRatecardComponent implements OnInit {

// AG grid setup props
private rowDataCallPlan;
private columnDefsCallPlan;

private rowDataRatecard;
private columnDefsRatecard;
private getNodeChildDetails;

private rowDataReview;
private columnDefsReview;

// AG grid API props
private gridApiCallPlan: GridApi;
private gridApiRatecard: GridApi;
private gridApiDetails: GridApi;

// AG grid UI props
private rowSelectionS = 'single';
private rowSelectionM = 'multiple';
private currentSliderValue;

// UI Props
private buttonToggleBoolean = true;
private gridSelectionStatus: number;

// Internal Service Props
private currentRowId;

constructor(
    private callPlanService: CallPlanService,
    private callPlanSharedService: CallPlanSharedService,
    private rateCardsService: RateCardsService,
    private nestedAgGridService: NestedAgGridService,
    private snackbarSharedService: SnackbarSharedService
) {
    this.getNodeChildDetails = this.setGroups();
    this.columnDefsCallPlan = this.createColumnDefsCallPlan();
    this.columnDefsRatecard = this.createColumnDefsRatecard();
    // this.columnDefsReview = this.createColumnDefsReview();
}

ngOnInit() {
    this.get_CallPlans();
    this.get_RateCards();
    // this.callPlanSharedService.currentRowAll.subscribe(data => this.currentRowId = data);
}

// ================================================================================
// API Service
// ================================================================================
get_CallPlans(): void {
    this.callPlanService.get_allCallPlan().subscribe(
        data => {
            this.rowDataCallPlan = data;
        }
    );
}

get_RateCards(): void {
    this.rateCardsService.get_RateCard().subscribe(
        data => {
            this.rowDataRatecard = this.nestedAgGridService.formatDataToNestedArr(data);
        }
    );
}

// post_attachRateCard(): void {
//     const callplanId = this.currentRowId;
//     const selectedRows = this.gridApiRatecard.getSelectedRows();
//     for (let i = 0; i < selectedRows.length; i++) {
//         const ratecardId = selectedRows[i].id;
//         const body = {
//             priority: selectedRows[i].priority
//         };

//         this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
//             .subscribe(
//                 (resp: Response) => {
//                     console.log(resp);
//                     if ( resp.status === 200 ) {
//                         this.snackbarSharedService.snackbar_success('Ratecard attached successful.', 2000);
//                     }
//                 },
//                 error => {
//                     console.log(error);
//                     this.snackbarSharedService.snackbar_error('Ratecard failed to attach.', 2000);
//                 }
//             );
//     }
// }

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

// ================================================================================
// AG Grid UI
// ================================================================================
aggrid_gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
}

onSelectionChangedCallPlanTable() {
    console.log( this.getSelectedCallPlanTableData());
}

deselectAll() {
    this.gridApiCallPlan.deselectAll();
}

// ================================================================================
// AG Grid Fetch Data
// ================================================================================
getSelectedCallPlanTableData(): Array<{}> {
    return this.gridApiCallPlan.getSelectedRows();
}

// /*
//     ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
// */
// handleSliderChange(params) {
//     const currentSliderValue = params.value;
//     this.currentSliderValue = currentSliderValue;
//     this.updateDetailGridData(currentSliderValue);
// }

// updateDetailGridData(currentSliderValue) {
//     const itemsToUpdate = [];
//     this.gridApiDetails.forEachNodeAfterFilterAndSort(function(rowNode) {
//         const data = rowNode.data;
//         data.priority = currentSliderValue;
//         itemsToUpdate.push(data);
//     });

//     this.gridApiDetails.updateRowData({update: itemsToUpdate });
//     this.gridApi.updateRowData({update: itemsToUpdate});
// }

// rowSelected(): void { // Toggle button boolean if rowSelected > 0
//     this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
// }

toggleButtonStates(): boolean {
    if ( this.gridSelectionStatus > 0 ) {
      this.buttonToggleBoolean = false;
    } else {
      this.buttonToggleBoolean = true;
    }
    return this.buttonToggleBoolean;
}

// click_attachRatecard(): void { // trigger on submit click
//     this.post_attachRateCard();
// }

}
