import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi, ColumnApi } from 'ag-grid';

import { ImporterService } from './../services/importer.api.service';
import { ImporterSharedService } from './../services/importer.shared.service';
import { RateCardsService } from './../../rate-cards/services/rate-cards.api.service';
import { SnackbarSharedService } from './../../global-service/snackbar.shared.service';

import { UploadRatesDialogComponent } from './dialog/upload-rates/upload-rates-dialog.component';

@Component({
    selector: 'app-importer-table',
    templateUrl: './importer-table.component.html',
    styleUrls: ['./importer-table.component.scss']
})
export class ImporterTableComponent implements OnInit {

    // row data and column defs
    private rowData;
    private columnDefs;

    // gridApi & gridUI
    private gridApi: GridApi;
    private getNodeChildDetails;
    private rowSelection;
    private quickSearchValue = '';

    // Internal Service props
    private rowObj;
    private postTableArr;

    constructor(
        private importerService: ImporterService,
        private importerSharedService: ImporterSharedService,
        private dialog: MatDialog,
        private rateCardsService: RateCardsService
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.getNodeChildDetails = this.setGroups();
        this.importerSharedService.currentPostTableObj.subscribe(
            data => { this.rowData = data; }
        );
    }

    /*
        ~~~~~~~~~~ Importer API services ~~~~~~~~~~
    */
    put_EditRates(id, ratecardObj) {
        this.importerService.put_EditRates(id, ratecardObj)
            .subscribe(resp => console.log(resp));
    }

    post_attachTrunkToRatecard(ratecardId: number, trunkId: number) {
        this.rateCardsService.post_AttachTrunk(ratecardId, trunkId)
            .subscribe(resp => console.log(resp));
    }

    put_editTeleuDbRates(teleu_db_rate_id: number, body: any) {
        this.rateCardsService.put_EditTeleuDbRates(teleu_db_rate_id, body)
            .subscribe(resp => console.log(resp));
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
            }
        },
        {
            headerName: 'Prefix', field: 'prefix', width: 150,
            checkboxSelection: true, headerCheckboxSelection: true,
            cellStyle: {
                'border-right': '1px solid #E0E0E0'
            },
        },
        {
            headerName: 'Tele-U(Data Base)',
            marryChildren: true,
            children: [
                {
                    headerName: 'Buy Rate', field: 'teleu_db_buy_rate', width: 140,
                    editable: true,
                    cellClassRules: {
                        'teleu_db-buyrate-highlight': function(params) {
                            return params.value < params.data.teleu_buy_rate;
                        }
                    },
                },
                {
                    headerName: 'Sell Rate', field: 'teleu_db_sell_rate', width: 140,
                    editable: true,
                },
                {
                    headerName: 'Diff', width: 170,
                    valueGetter: function(params) {
                        if (params.data.teleu_db_buy_rate > 0) {
                            const diff = (params.data.teleu_db_sell_rate - params.data.teleu_db_buy_rate);
                            const percent = ((diff) / params.data.teleu_db_buy_rate) * 100;
                            const diffFixed = diff.toFixed(4);
                            const percentFixed = percent.toFixed(2);
                            return `${diffFixed}(${percentFixed}%)`;
                        } else {
                            return '';
                        }
                    },
                },
                {
                    headerName: 'Fixed', field: 'fixed', width: 120, editable: true,
                    cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
                }
            ]
        },
        {
            headerName: 'Tele-U(From Ratecard)',
            marryChildren: true,
            children: [
                {
                    headerName: 'Buy Rate', field: 'teleu_buy_rate', width: 140,
                    editable: true, volatile: true,
                    cellClassRules: {
                        'teleu-buyrate-highlight': function(params) {
                            return params.value > params.data.teleu_db_buy_rate;
                        }
                    },
                    cellStyle: {
                        'border-left': '1px solid #E0E0E0'
                    },
                },
                {
                    headerName: 'Sell Rate', field: 'teleu_sell_rate', width: 140,
                    editable: true,
                },
                {
                    headerName: 'Diff', width: 170,
                    valueGetter: function(params) {
                        if (params.data.teleu_buy_rate > 0) {
                            const diff = (params.data.teleu_sell_rate - params.data.teleu_buy_rate);
                            const percent = ((diff) / params.data.teleu_buy_rate) * 100;
                            const diffFixed = diff.toFixed(4);
                            const percentFixed = percent.toFixed(2);
                            return `${diffFixed}(${percentFixed}%)`;
                        } else {
                            return '';
                        }
                    }
                },
                {
                    headerName: 'C', field: 'teleu_confirmed', width: 120, editable: true,
                    cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
                    cellStyle: {
                        'border-right': '1px solid #E0E0E0'
                    },
                }
            ]
        },
        {
            headerName: 'Private Offer',
            marryChildren: true,
            children: [
                {
                    headerName: 'Buy Rate', field: 'private_buy_rate', width: 140,
                    editable: true
                },
                {
                    headerName: 'Sell Rate', field: 'private_sell_rate', width: 140,
                    editable: true
                },
                {
                    headerName: 'Diff', width: 170,
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
                },
                {
                    headerName: 'C', field: 'private_confirmed', width: 120, editable: true,
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

    expandAll(expand: boolean) {
        this.gridApi.forEachNode((node) => {
            if ( node.group) {
                node.setExpanded(expand);
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
            isFixed: JSON.parse(params.data.fixed);
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
        const dialogRef = this.dialog.open(UploadRatesDialogComponent, {
            width: '60vw'
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
                } else {
                }
            });

            for ( let i = 0; i < ratecardIdArr.length; i ++ ) {
                this.post_attachTrunkToRatecard(ratecardIdArr[i], trunkId);
            }
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    }

}
