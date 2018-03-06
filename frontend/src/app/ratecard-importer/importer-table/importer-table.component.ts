import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi, ColumnApi } from 'ag-grid';

import { ImporterService } from './../services/importer.api.service';
import { ImporterSharedService } from './../services/importer.shared.service';

import { UploadRatesDialogComponent } from './dialog/upload-rates/upload-rates-dialog.component';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';

@Component({
    selector: 'app-importer-table',
    templateUrl: './importer-table.component.html',
    styleUrls: ['./importer-table.component.scss'],
    providers: [ ImporterService ]
})
export class ImporterTableComponent implements OnInit, AfterViewChecked {

    // row data and column defs
    private rowData;
    private columnDefs;
    private getNodeChildDetails;
    private rowSelection;
    private quickSearchValue = '';

    // gridApi and columnApi
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // Shared Service props
    private rowObj;
    private postTableArr;

    constructor(
        private importerService: ImporterService,
        private importerSharedService: ImporterSharedService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.getNodeChildDetails = this.setGroups();
        this.importerSharedService.currentPostTableObj.subscribe(
            data => { this.rowData = data; }
        );
    }

    ngAfterViewChecked() {
        this.gridApi.sizeColumnsToFit();
    }

    /*
        ~~~~~~~~~~ Importer API services ~~~~~~~~~~
    */
    put_EditRates(id, ratecardObj) {
        this.importerService.put_EditRates(id, ratecardObj)
            .subscribe(resp => console.log(resp));
    }

    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.columnDefs = this.createColumnDefs();
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
                    headerName: 'Fixed', field: 'fixed', width: 120,
                    editable: true,
                }
            ]
        },
        {
            headerName: 'Tele-U(From Ratecard)',
            marryChildren: true,
            children: [
                {
                    headerName: 'Buy Rate', field: 'teleu_buy_rate', width: 140,
                    editable: true,
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
                    headerName: 'C', field: 'teleu_confirmed', width: 120,
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
                    headerName: 'C', field: 'private_confirmed', width: 120,
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
                // expanded: rowItem.group === "Group C",
                children: rowItem.rates,
                key: rowItem.ratecard_name
            };
            } else {
            return null;
            }
        };
    }

    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
    on_GridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

    aggrid_rowSelected(params): void {
        console.log(this.gridApi.getSelectedRows());
    }

    aggrid_onCellValueChanged(params): void {
        const teleu_rate_id = params.data.teleu_rate_id;
        const private_rate_id = params.data.private_rate_id;
        const body_TeleU = {
            buy_rate: parseFloat(params.data.teleu_buy_rate),
            sell_rate: parseFloat(params.data.teleu_sell_rate)
        };
        const body_Private = {
            buy_rate: parseFloat(params.data.private_buy_rate),
            sell_rate: parseFloat(params.data.private_sell_rate)
        };

        if ( params.data.teleu_buy_rate ) {
            this.put_EditRates(teleu_rate_id, body_TeleU);
        }
        if ( params.data.private_buy_rate ) {
            this.put_EditRates(private_rate_id, body_Private);
        }
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    openDialogUpload(): void {
        const dialogRef = this.dialog.open(UploadRatesDialogComponent, {});

        // const sub = dialogRef.componentInstance.event_onAdd.subscribe(edata => {
        //     {
        //         this.importerSharedService.currentPostTableObj.subscribe( data => {
        //             this.gridApi.setRowData(data);
        //         });
        //     }
        // });

        dialogRef.afterClosed().subscribe(() => {
            console.log('The dialog was closed');
        });
    }

}
