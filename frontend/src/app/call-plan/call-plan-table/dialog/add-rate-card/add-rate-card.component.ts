import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnApi, GridApi } from 'ag-grid';

import { CallPlanTableComponent } from './../../../call-plan-table/call-plan-table.component';

import { CallPlanService } from '../../../services/call-plan.api.service';
import { CallPlanSharedService } from './../../../services/call-plan.shared.service';
import { RateCardsService } from './../../../../rate-cards/services/rate-cards.api.service';

declare global { // declare global interface, set custom fn groupBy with type any
    interface Array<T> {
      groupBy(elem: T): Array<T>;
    }
}

@Component({
  selector: 'app-add-rate-card',
  templateUrl: './add-rate-card.component.html',
  styleUrls: ['./add-rate-card.component.scss']
})
export class AddRateCardComponent implements OnInit {

    // Events
    event_onAdd = new EventEmitter();

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

    // Format Data Props
    private groupedArr = [];
    private formattedObj = [];
    private formattedRowData;

    // Internal Service Props
    // private rateCardsFromService;
    // private finalRateCardObj = [];
    // private callPlanObj = [];
    private currentRowId;

    constructor(
        public dialogRef: MatDialogRef<CallPlanTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private callPlanService: CallPlanService,
        private callPlanSharedService: CallPlanSharedService,
        private rateCardsService: RateCardsService
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
                this.rowData = data;
                this.formatDataToNestedArr();
            },
            error => { console.log(error); },
        );
    }

    // post_attachRateCard(): void {
    //     const callplanId = this.currentRowId;
    //     // const body = {
    //     //     priority: this.choosePriorityFormGroup.get('priorityCtrl').value
    //     // };
    //     this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
    //             .subscribe(resp => console.log(resp));
    // }

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
                headerName: 'Offer', field: 'offer'
            },
            {
                headerName: 'Carrier', field: 'carrier_name'
            }
        ];
    }

    private createColumnDefsReview() {
        return [
            {
                headerName: 'ID', field: 'id',
            },
            {
                headerName: 'Ratecard', field: 'ratecard_bundle',
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
        ~~~~~~~~~~ Format Data ~~~~~~~~~~
    */
   formatDataToNestedArr() {
        this.addAdditionalFieldsToArr();
        this.groupDataByName();
        this.formNewJSONObj();
        this.insertObjInNestedChildrenArr();
    }

    addAdditionalFieldsToArr() {
        const insertNewFieldsArr = [];
        for (let i = 0; i < this.rowData.length; i++) {
            const currentNameString = this.rowData[i].name;
            const splitPound = currentNameString.split('#');

            insertNewFieldsArr.push({
            ratecard_bundle: splitPound[0],
            name: splitPound[0],
            offer: splitPound[2],
            country: splitPound[3],
            id: this.rowData[i].id,
            carrier_id: this.rowData[i].carrier_id,
            carrier_name: this.rowData[i].carrier_name,
            confirmed: this.rowData[i].confirmed,
            active: this.rowData[i].active
            });
        }
        this.rowData = insertNewFieldsArr;
    }

    groupDataByName() {
        Array.prototype.groupBy = function (prop): any {
            return this.reduce(function (groups, item) {
                groups[item[prop]] = groups[item[prop]] || [];
                groups[item[prop]].push(item);
                return groups;
            }, {});
        };
        this.rowData = this.rowData.groupBy('name');

        for (const item in this.rowData) {
            if ( item !== '' ) {
                this.groupedArr.push(this.rowData[item]);
            } else {
            }
        }
        console.log(this.groupedArr);
    }

    formNewJSONObj() {
        for (let i = 0; i < this.groupedArr.length; i++) {
            this.formattedObj.push(
            {
                ratecard_bundle: this.groupedArr[i][0].name,
                children: []
            }
            );
        }
    }

    insertObjInNestedChildrenArr() {
        for (let i = 0; i < this.formattedObj.length; i++) {
            for (let x = 0; x < this.groupedArr[i].length; x++) {
                this.formattedObj[i].children.push(
                    this.groupedArr[i][x]
                );
            }
            }
        this.formattedRowData = this.formattedObj;
    }

    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    aggrid_gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
        // click_attachRatecard(): void { // trigger on submit click
        //     this.post_attachRateCard();
        //     this.aggrid_attachRatecards();
        //     this.closeDialog();
        // }

        // aggrid_attachRatecards(): void {
        //     const body = {
        //         // name: this.getSelectedRateCardName(),
        //     };

        //     this.event_onAdd.emit(body);
        // }

        // closeDialog(): void { // close dialog
        //     this.dialogRef.close();
        // }
}
