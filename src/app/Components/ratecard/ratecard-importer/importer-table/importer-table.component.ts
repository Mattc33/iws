import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { GridApi } from 'ag-grid'

import { ImporterService } from '../../../../shared/api-services/ratecard/importer.api.service'
import { ImporterSharedService } from '../../../../shared/common-services/ratecard/importer.shared.service'
import { RateCardsService } from '../../../../shared/api-services/ratecard/rate-cards.api.service'
import { SnackbarSharedService } from '../../../../shared/common-services/global/snackbar.shared.service'
import { UploadRatesDialogComponent } from './dialog/upload-rates/upload-rates-dialog.component'
import ImporterTableGridHelper from './importer-table.grid-helper'
@Component({
    selector: 'app-importer-table',
    templateUrl: './importer-table.component.html',
    styleUrls: ['./importer-table.component.scss']
})
export class ImporterTableComponent implements OnInit {

    // ! String Interpolation Values
    numberOfRatesInRatecard: number
    numberOfRatesInResponse: number

    // ! AG Grid
    rowData: Array<{}>
    columnDefs: Array<{}>

    // * gridApi & gridUI
    gridApi: GridApi
    getNodeChildDetails: any
    rowSelection: string
    quickSearchValue: string

    constructor(
        private _importerService: ImporterService,
        private _importerSharedService: ImporterSharedService,
        private _dialog: MatDialog,
        private _rateCardsService: RateCardsService,
        private _snackbarSharedService: SnackbarSharedService
    ) {
        this.columnDefs = ImporterTableGridHelper.createColumnDefs()
    }

    ngOnInit() {
        this.getNodeChildDetails = this.setGroups()
        this._importerSharedService.currentNumberOfRatesInRatecard
            .subscribe(numberOfRates => this.numberOfRatesInRatecard = numberOfRates)
        this._importerSharedService.currentNumberOfRatesInReponse
            .subscribe(numberOfRates => this.numberOfRatesInResponse = numberOfRates)
    }

    // ================================================================================
    // * Ratecard Importer API Services
    // ================================================================================
    put_EditRates(id, ratecardObj) {
        this._importerService.put_EditRates(id, ratecardObj)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbarSharedService.snackbar_success('Edit Successful.', 2000)
                    }
                },
                error => {
                    console.log(error);
                    this._snackbarSharedService.snackbar_error('Edit failed.', 2000)
                }
            )
    }

    post_attachTrunkToRatecard(ratecardId: number, trunkId: number) {
        this._rateCardsService.post_AttachTrunk(ratecardId, trunkId)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbarSharedService.snackbar_success('Trunk successfully attached.', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this._snackbarSharedService.snackbar_error('Trunk failed to attach.', 2000);
                }
            )
    }

    put_editTeleuDbRates(teleu_db_rate_id: number, body: any) {
        this._rateCardsService.put_EditTeleuDbRates(teleu_db_rate_id, body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbarSharedService.snackbar_success('Edit Successful.', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this._snackbarSharedService.snackbar_error('Edit failed.', 2000);
                }
            )
    }

    // ================================================================================
    // * AG Grid Initialization
    // ================================================================================
    on_GridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
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
        })
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
        else if ( params.data.private_buy_rate ) {
            this.put_EditRates(private_rate_id, body_Private);
        }
        else if ( params.data.teleu_db_buy_rate ) {
            this.put_editTeleuDbRates(teleu_db_rate_id, body_TeleU_DB);
        }

        params.api.redrawRows(); // reset view for css changes on edit
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    openDialogUpload(): void {
        const dialogRef = this._dialog.open(UploadRatesDialogComponent, {
            width: '80vw'
        })

        const sub = dialogRef.componentInstance.event_passTrunkId.subscribe((data) => {
            const ratecardIdArr = []
            const trunkId = data

            this.gridApi.forEachNode( rowNode => {
                if ( rowNode.data['ratecard_id (Private)'] ) {
                    ratecardIdArr.push( rowNode.data['ratecard_id (Private)'], );
                }
                else if ( rowNode.data['ratecard_id (TeleU)'] ) {
                    ratecardIdArr.push(rowNode.data['ratecard_id (TeleU)'], );
                }
            })

            for ( let i = 0; i < ratecardIdArr.length; i ++ ) {
                this.post_attachTrunkToRatecard(ratecardIdArr[i], trunkId);
            }
        })

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe()
            this._importerSharedService.currentRatesInResponse
                .subscribe(ratesInResponse => {
                    
                    this.gridApi.setRowData(ratesInResponse)
                })
                // ! @@@
                // i'll need to do some data transformation to get these in groups

        })
    }
}
