import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi, ColumnApi } from 'ag-grid';

import { ImporterService } from '../../../../shared/api-services/ratecard/importer.api.service';
import { ImporterSharedService } from '../../../../shared/services/ratecard/importer.shared.service';
import { RateCardsService } from '../../../../shared/api-services/ratecard/rate-cards.api.service';
import { SnackbarSharedService } from '../../../../shared/services/global/snackbar.shared.service';

import { UploadRatesDialogComponent } from './dialog/upload-rates/upload-rates-dialog.component';

@Component({
    selector: 'app-importer-table',
    templateUrl: './importer-table.component.html',
    styleUrls: ['./importer-table.component.scss']
})
export class ImporterTableComponent implements OnInit {

    // row data and column defs
    rowData;
    columnDefs;

    // gridApi & gridUI
    gridApi: GridApi;
    getNodeChildDetails;
    rowSelection;
    quickSearchValue = '';

    // Internal Service props
    rowObj;
    postTableArr;
    ratesInsertedIntoDB;
    totalRatesProcessed = 0;
    totalRatesFromCSV = 0;

    constructor(
        private importerService: ImporterService,
        private importerSharedService: ImporterSharedService,
        private dialog: MatDialog,
        private rateCardsService: RateCardsService,
        private snackbarSharedService: SnackbarSharedService
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.getNodeChildDetails = this.setGroups();
        this.importerSharedService.currentPostTableObj.subscribe(
            data => {
                this.totalRatesProcessed = 0;
                this.rowData = data;
                for ( let i = 0; i < this.rowData.length; i++ ) { this.totalRatesProcessed += this.rowData[i].rates.length; }
            }
        );

        this.importerSharedService.currentRatesCSVAmount.subscribe(
            data => {
                this.totalRatesFromCSV = 0;
                this.totalRatesFromCSV = data;
            }
        );
    }

    // ================================================================================
    // Ratecard Importer API Services
    // ================================================================================
    put_EditRates(id, ratecardObj) {
        this.importerService.put_EditRates(id, ratecardObj)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
                }
            );
    }

    post_attachTrunkToRatecard(ratecardId: number, trunkId: number) {
        this.rateCardsService.post_AttachTrunk(ratecardId, trunkId)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Trunk successfully attached.', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this.snackbarSharedService.snackbar_error('Trunk failed to attach.', 2000);
                }
            );
    }

    put_editTeleuDbRates(teleu_db_rate_id: number, body: any) {
        this.rateCardsService.put_EditTeleuDbRates(teleu_db_rate_id, body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
                }
            );
    }

    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs() {
    return [
        {
            headerName: 'Ratecard Name', field: 'ratecard_name',
            cellRenderer: 'agGroupCellRenderer', width: 350,
            valueFormatter: function(params) {
                const ratecard_name = params.data.ratecard_name;
                if ( ratecard_name ) {
                    const country = ratecard_name.split('#');
                    return country[0] + ' - ' + country[2];
                } else {
                    return ratecard_name;
                }
            },
            cellStyle: { 'border-right': '2px solid #E0E0E0' },
        },
        {
            headerName: 'Prefix', field: 'prefix', width: 150,
            // checkboxSelection: true, headerCheckboxSelection: true,
            cellStyle: { 'border-right': '2px solid #E0E0E0' },
        },
        // {
        //     headerName: 'Tele-U(Data Base)',
        //     marryChildren: true,
        //     children: [
        //         {
        //             headerName: 'Buy Rate', field: 'teleu_db_buy_rate', width: 140,
        //             editable: true, columnGroupShow: 'closed',
        //             cellClassRules: {
        //                 'teleu_db-buyrate-highlight': function(params) {
        //                     return params.value < params.data.teleu_buy_rate;
        //                 }
        //             },
        //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
        //         },
        //         {
        //             headerName: 'Sell Rate', field: 'teleu_db_sell_rate', width: 140,
        //             editable: true, columnGroupShow: 'closed',
        //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
        //         },
        //         {
        //             headerName: 'Difference', width: 170,
        //             valueGetter: function(params) {
        //                 if (params.data.teleu_db_buy_rate > 0) {
        //                     const diff = (params.data.teleu_db_sell_rate - params.data.teleu_db_buy_rate);
        //                     const percent = ((diff) / params.data.teleu_db_buy_rate) * 100;
        //                     const diffFixed = diff.toFixed(4);
        //                     const percentFixed = percent.toFixed(2);
        //                     return `${diffFixed}(${percentFixed}%)`;
        //                 } else {
        //                     return '';
        //                 }
        //             }, columnGroupShow: 'closed',
        //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
        //         },
        //         {
        //             headerName: 'Fixed', field: 'fixed', width: 120, editable: true,
        //             cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
        //             columnGroupShow: 'closed',
        //             cellStyle: { 'border-right': '2px solid #E0E0E0' },
        //         }
        //     ]
        // },
        // {
        //     headerName: 'Tele-U(From Ratecard)',
        //     marryChildren: true,
        //     children: [
        //         {
        //             headerName: 'Buy Rate', field: 'teleu_buy_rate', width: 140,
        //             editable: true, volatile: true, columnGroupShow: 'closed',
        //             cellClassRules: {
        //                 'teleu-buyrate-highlight': function(params) {
        //                     return params.value > params.data.teleu_db_buy_rate;
        //                 }
        //             },
        //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
        //         },
        //         {
        //             headerName: 'Sell Rate', field: 'teleu_sell_rate', width: 140,
        //             editable: true, columnGroupShow: 'closed',
        //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
        //         },
        //         {
        //             headerName: 'Difference', width: 170, columnGroupShow: 'closed',
        //             valueGetter: function(params) {
        //                 if (params.data.teleu_buy_rate > 0) {
        //                     const diff = (params.data.teleu_sell_rate - params.data.teleu_buy_rate);
        //                     const percent = ((diff) / params.data.teleu_buy_rate) * 100;
        //                     const diffFixed = diff.toFixed(4);
        //                     const percentFixed = percent.toFixed(2);
        //                     return `${diffFixed}(${percentFixed}%)`;
        //                 } else {
        //                     return '';
        //                 }
        //             },
        //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
        //         },
        //         {
        //             headerName: 'Confirmed?', field: 'teleu_confirmed', width: 120, editable: true,
        //             cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
        //             cellStyle: {
        //                 'border-right': '2px solid #E0E0E0'
        //             }, columnGroupShow: 'closed',
        //         }
        //     ]
        // },
        {
            headerName: 'Private Offer',
            marryChildren: true,
            children: [
                {
                    headerName: 'Buy Rate', field: 'private_buy_rate', width: 160,
                    editable: true,
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                },
                {
                    headerName: 'Sell Rate', field: 'private_sell_rate', width: 140,
                    editable: true,
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                },
                {
                    headerName: 'Difference', width: 170,
                    valueGetter: function(params) {
                        if (params.data.private_buy_rate > 0) {
                            const diff = (params.data.private_sell_rate - params.data.private_buy_rate);
                            const percent = ((diff) / params.data.private_buy_rate) * 100;
                            const diffFixed = diff.toFixed(4);
                            const percentFixed = percent.toFixed(2);
                            return `${diffFixed}(${percentFixed}%)`;
                        } else {
                            return '';
                        }
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                },
                {
                    headerName: 'Confirmed?', field: 'private_confirmed', width: 120, editable: true,
                    cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
                }
            ]
        }
    ];
    }

    setGroups() {
        return function getNodeChildDetails(rowItem) {
            if (rowItem.rates) {
                return {
                    group: true,
                    children: rowItem.rates,
                    key: rowItem.ratecard_name
                };
            } else {
                return null;
            }
        };
    }

    /*
        ~~~~~~~~~~ Grid UI  ~~~~~~~~~~
    */
    gridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

    expandCollaspeHandler(e: boolean) {
        this.gridApi.forEachNode((node) => {
            if ( node.group) {
                node.setExpanded(e);
            }
        });
    }

    /*
        ~~~~~~~~~~ Grid CRUD  ~~~~~~~~~~
    */
    onCellValueChanged(params): void {
        const teleu_rate_id = params.data.teleu_rate_id;
        const private_rate_id = params.data.private_rate_id;
        const teleu_db_rate_id = params.data.teleu_db_rate_id;
        const body_TeleU = {
            buy_rate: parseFloat(params.data.teleu_buy_rate),
            sell_rate: parseFloat(params.data.teleu_sell_rate)
        };
        const body_Private = {
            buy_rate: parseFloat(params.data.private_buy_rate),
            sell_rate: parseFloat(params.data.private_sell_rate)
        };
        const body_TeleU_DB = {
            buy_rate: parseFloat(params.data.teleu_db_buy_rate),
            sell_rate: parseFloat(params.data.teleu_db_sell_rate),
            isFixed: JSON.parse(params.data.fixed)
        };

        if ( params.data.teleu_buy_rate ) {
            this.put_EditRates(teleu_rate_id, body_TeleU);
        }
        if ( params.data.private_buy_rate ) {
            this.put_EditRates(private_rate_id, body_Private);
        }
        if ( params.data.teleu_db_buy_rate ) {
            this.put_editTeleuDbRates(teleu_db_rate_id, body_TeleU_DB);
        }

        params.api.redrawRows(); // reset view for css changes on edit
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    openDialogUpload(): void {

        this.totalRatesFromCSV = 0;

        const dialogRef = this.dialog.open(UploadRatesDialogComponent, {
            width: '80vw'
        });

        const sub = dialogRef.componentInstance.event_passTrunkId.subscribe((data) => {
            const ratecardIdArr = [];
            const trunkId = data;

            this.gridApi.forEachNode( function(rowNode) {
                if ( rowNode.data['ratecard_id (Private)'] ) {
                    ratecardIdArr.push( rowNode.data['ratecard_id (Private)'], );
                }
                if ( rowNode.data['ratecard_id (TeleU)'] ) {
                    ratecardIdArr.push(rowNode.data['ratecard_id (TeleU)'], );
                }
            });

            for ( let i = 0; i < ratecardIdArr.length; i ++ ) {
                this.post_attachTrunkToRatecard(ratecardIdArr[i], trunkId);
            }
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
        });
    }

}
