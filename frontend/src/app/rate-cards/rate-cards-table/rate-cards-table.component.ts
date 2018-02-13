import { AgGridModule } from 'ag-grid-angular';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi, Column } from 'ag-grid';

import { DeleteRateCardsDialogComponent } from './dialog/delete-rate-cards/delete-rate-cards-dialog.component';
import { UploadRatesDialogComponent } from './dialog/upload-rates/upload-rates-dialog.component';
import { AttachTrunksDialogComponent } from './dialog/attach-trunks/attach-trunks-dialog.component';
import { DeleteRatesComponent } from './dialog/delete-rates/delete-rates.component';

import { RateCardsService } from '../services/rate-cards.api.service';
import { RateCardsSharedService } from '../services/rate-cards.shared.service';
import { RatesService } from './../../rates/services/rates.api.service';

@Component({
    selector: 'app-rate-cards-table',
    templateUrl: './rate-cards-table.component.html',
    styleUrls: ['./rate-cards-table.component.scss'],
    providers: [ RateCardsService ],
})
export class RateCardsTableComponent implements OnInit {

    // Define row and column data
    private rowData; // All
    private columnDefs;

    private columnDefsRates;
    private columnDefsTrunks;

    // AG grid props
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    private gridApiRates: GridApi;
    private columnApiRates: ColumnApi;

    private gridApiTrunks: GridApi;
    private columnApiTrunks: ColumnApi;

    // Props for AG Grid
    private defineRowSelectionType = 'multiple';
    private defineRowSelectionTypeS = 'single';
    private rowSelectionAll;
    private rowSelectionRates;
    private rowSelectionTrunks;
    
    // Properties for internal service
    private rowRatecardObj;
    private quickSearchValue: string = '';
    private rowIdAll;

    constructor(
        private rateCardsService: RateCardsService, 
        private rateCardsSharedService: RateCardsSharedService,
        private ratesService: RatesService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.on_InitializeRows();
    }

    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    put_editRateCard(rateCardObj:object, id: number) {
        this.rateCardsService.put_EditRateCard(rateCardObj, id)
            .subscribe(resp => console.log(resp));
    }

    on_InitializeRows(): void {
        this.rateCardsService.get_RateCard()
            .subscribe(
                data => { this.rowData = data; },
                error => { console.log(error); }
            );
    }

    put_editRates(rateCardObj: object, id: number) {
        this.ratesService.put_Rates(id, rateCardObj)
            .subscribe(resp => console.log(resp));
    }

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.columnDefs = this.createColumnDefs();
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    };

    on_GridReady_Rates(params): void {
        this.columnDefsRates = this.createColumnDefsRates();
        this.gridApiRates = params.api;
        this.columnApiRates = params.ColumnApi;
        this.gridApiRates.sizeColumnsToFit();
    };

    on_GridReady_Trunks(params): void {
        this.columnDefsTrunks = this.createColumnDefsRates();
        this.gridApiTrunks = params.api;
        this.columnApiTrunks = params.ColumnApi;
        this.gridApiTrunks.sizeColumnsToFit();
    };

    private createColumnDefs() {
        return [
            {
                headerName: 'Carrier', field: 'carrier_name', checkboxSelection: true,
            },
            {
                headerName: 'Rate Card', field: 'name', width: 250,
                editable: true
            },
            {
                headerName: 'Approved?'
            },
        ];
    };

    private createColumnDefsRates() {
        return [
            {
                headerName: 'Prefix', field: 'prefix',
                checkboxSelection: true, headerCheckboxSelection: true,
            },
            {
                headerName: 'Destination', field: 'destination',
            },
            {
                headerName: 'Buy Rate', field: 'buy_rate', editable: true,
            },
            {
                headerName: 'Sell Rate', field: 'sell_rate', editable: true,
            },
            {
                headerName: 'Difference', 
                valueGetter: function(params) {
                    const diff = (params.data.sell_rate - params.data.buy_rate);
                    const percent = ((diff) / params.data.buy_rate) * 100;
                    const diffFixed = diff.toFixed(4);
                    const percentFixed = percent.toFixed(2);

                    return `${diffFixed}(${percentFixed}%)`;
                },
            },
            {
                headerName: 'Approved?', field: 'confirmed', editable: true,
            }
        ]
    };

    private createColumnsDefsTrunks() {
        return [
            {
                headerName: 'Carrier Name', field: 'carrier_name',
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
            },
            {
                headerName: 'Meta Data', field: 'metadata',
            }
        ]
    };

    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
        aggrid_gridSizeChanged(params) {
            params.api.sizeColumnsToFit();
        }

        onQuickFilterChanged() { // external global search
            this.gridApi.setQuickFilter(this.quickSearchValue);
        }

        /*
            ~~~~~ Selection ~~~~~
        */
        aggrid_selectionChanged(): void {
            this.gridApiRates.setRowData([]);

            this.rowRatecardObj = this.gridApi.getSelectedRows();
            const selectedRatecardId = this.rowRatecardObj[0].id;

            this.rateCardsService.get_SpecificRateCard(selectedRatecardId)
                .subscribe(
                    data => {this.gridApiRates.updateRowData({ add: data });}
                );
            
            this.rateCardsService.get_SpecificRateCard(selectedRatecardId)
                .subscribe(
                    data => {this.gridApiTrunks.updateRowData({ add: data.trunks })}
                )
        };

        aggrid_rates_selectionChanged(): void {
            this.rowSelectionRates = this.gridApiRates.getSelectedRows();
            console.log(this.rowSelectionRates);
        }

        /*
            ~~~~~ Deletion ~~~~~
        */
        aggrid_delRow(string): void {
            if (string == 'delete-ratecards') {
                this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
            } 
            if (string == 'delete-rates') {
                this.gridApiRates.updateRowData({ remove: this.gridApiRates.getSelectedRows() });
            }
            if (string == 'delete-trunks') {
                this.gridApiTrunks.updateRowData({ remove: this.gridApiTrunks.getSelectedRows() });
            }
            else {
                return;
            }
        }
        
        /*
            ~~~~~ Addition ~~~~~
        */
        aggrid_addRow(obj): void {
            this.gridApi.updateRowData({ add: [obj] });
        }

        /*
            ~~~~~ Edit ~~~~~
        */
        aggrid_onCellValueChanged(params: any) {
            const id = params.data.id;
            const rateCardObj = {
                name: params.data.name,
                carrier_id: params.data.carrier_id,
                confirmed: params.data.confirmed
            };

            this.put_editRateCard(rateCardObj, id);
        };

        aggrid_onCellValueChanged_rates(params: any) {
            const id = params.data.id;
            const ratesObj =  {
                sell_rate: parseInt(params.data.sell_rate), 
                buy_rate: parseInt(params.data.buy_rate)
            }

            this.put_editRates(ratesObj, id);
        }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */  

        /*
            ~~~~~ Rate cards ~~~~~
        */
        openDialogDel(): void {
            this.rateCardsSharedService.changeRowObj(this.rowRatecardObj);

            const dialogRef = this.dialog.open(DeleteRateCardsDialogComponent, {});

            const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
                this.aggrid_delRow(data);
            });

            dialogRef.afterClosed().subscribe(() => {
                sub.unsubscribe();
                console.log('The dialog was closed');
            });
        }

        openDialogUpload(): void {
            const dialogRef = this.dialog.open(UploadRatesDialogComponent, {});

            dialogRef.afterClosed().subscribe(() => {

                console.log('The dialog was closed');
            });
        }
        
        /*
            ~~~~~ Rates ~~~~~
        */
        openDialogDelRates(): void {
            this.rateCardsSharedService.changeRowRatesObj(this.rowSelectionRates);

            const dialogRef = this.dialog.open(DeleteRatesComponent, {});

            const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
                this.aggrid_delRow(data);
            });

            dialogRef.afterClosed().subscribe(() => {
                sub.unsubscribe();
                console.log('The dialog was closed');
            });
        }

        /*
            ~~~~~ Trunks ~~~~~
        */
        openDialogDelTrunks(): void {
            
        }

        openDialogAttachTrunks(): void {
            const dialogRef = this.dialog.open(AttachTrunksDialogComponent, {});

            const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
                // do something with event data
                // this.aggrid_addRow(data);
            });

            dialogRef.afterClosed().subscribe(() => {
                // sub.unsubscribe();
                console.log('The dialog was closed');
            });
        }
}
