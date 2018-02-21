import { AgGridModule } from 'ag-grid-angular';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi, Column } from 'ag-grid';

import { DeleteRatesComponent } from './dialog/delete-rates/delete-rates.component';
import { DeleteRateCardsDialogComponent } from './dialog/delete-rate-cards/delete-rate-cards-dialog.component';
import { UploadRatesDialogComponent } from './dialog/upload-rates/upload-rates-dialog.component';
import { AttachTrunksDialogComponent } from './dialog/attach-trunks/attach-trunks-dialog.component';
import { DetachTrunksComponent } from './dialog/detach-trunks/detach-trunks.component';

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

    // Props for button toggle
    private buttonToggleBoolean: boolean = true;
    private gridSelectionStatus: number;
    private buttonToggleBoolean_trunks: boolean = true;
    private gridSelectionStatus_trunks: number;
    
    // Properties for internal service
    private rowRatecardObj;
    private quickSearchValue: string = '';
    private rowIdAll;
    private selectedRatecardId: number;

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

        this.activeFilter(); // activate filter for all ratecards table
    };

    on_GridReady_Trunks(params): void {
        this.columnDefsTrunks = this.createColumnsDefsTrunks();
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
                headerName: 'Approved?', editable: true, field: 'confirmed',
                valueFormatter: function(params) {
                    if(params.value === 1) {
                        return true
                    } 
                    if(params.value === 0) {
                        return false
                    }
                },
                cellEditor: 'select', cellEditorParams: {values: [ true, false]},

            },
            {
                headerName: 'Active', field: 'active', filter: "agNumberColumnFilter", hide: true
            }
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
                filter: "agNumberColumnFilter"
            },
            {
                headerName: 'Sell Rate', field: 'sell_rate', editable: true,
                filter: "agNumberColumnFilter"
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
                cellEditor: 'select', cellEditorParams: {values: [ true, false]},
                valueFormatter: function(params) {
                    if(params.value === 1) {
                        return true
                    }
                    if(params.value === 0) {
                        return false
                    }
                },
            },
            {
                headerName: 'Active?', field: 'active', editable: true,
                cellEditor: 'select', cellEditorParams: {values: [ true, false]},
                valueFormatter: function(params) {
                    if(params.value === 1) {
                        return true
                    }
                    if(params.value === 0) {
                        return false
                    }
                },
            }
        ]
    };

    private createColumnsDefsTrunks() {
        return [
            {
                headerName: 'Trunk Id', field: 'cx_trunk_id',
                checkboxSelection: true,
            },
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

        activeFilter(): void { // Trigger this to filter all disabled rows
            const activeFilterComponent = this.gridApi.getFilterInstance('active');
            activeFilterComponent.setModel({
                type: "greaterThan",
                filter: 0
            })
            this.gridApi.onFilterChanged();
        }

        /*
            ~~~~~ Selection ~~~~~
        */
        aggrid_selectionChanged(): void {
            this.gridApiRates.setRowData([]);
            this.gridApiTrunks.setRowData([]);

            this.rowRatecardObj = this.gridApi.getSelectedRows();
            this.selectedRatecardId = this.rowRatecardObj[0].id;

            this.rateCardsService.get_RatesInRatecard(this.selectedRatecardId) 
                .subscribe(
                    data => {
                        this.gridApiRates.updateRowData({ add: data });
                    }
                );

            this.rateCardsService.get_SpecificRatecard(this.selectedRatecardId)
                .subscribe (
                    data => {
                        this.gridApiTrunks.updateRowData({ add: data.trunks });
                    }
                );
        };

        aggrid_rates_selectionChanged(): void {
            this.rowSelectionRates = this.gridApiRates.getSelectedRows();
            console.log(this.rowSelectionRates);
        }

        aggrid_trunks_selectionChanged(): void {
            this.rowSelectionTrunks = this.gridApiTrunks.getSelectedRows();
            console.log(this.rowSelectionTrunks);
        }

        /*
            ~~~~~~~~~~ Button Toggle ~~~~~~~~~~
        */
        rowSelected(params) {
            this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
        }
        
        toggleButtonStates() {
            if ( this.gridSelectionStatus > 0 ) {
                this.buttonToggleBoolean = false;
            } else {
                this.buttonToggleBoolean = true;
            }
            return this.buttonToggleBoolean;
        }
        
        rowSelected_trunks(params) {
            this.gridSelectionStatus_trunks = this.gridApiTrunks.getSelectedNodes().length;
        }
        
        toggleButtonStates_trunks() {
            if ( this.gridSelectionStatus_trunks > 0 ) {
                this.buttonToggleBoolean_trunks = false;
            } else {
                this.buttonToggleBoolean_trunks = true;
            }
            return this.buttonToggleBoolean_trunks;
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
                confirmed: JSON.parse(params.data.confirmed)
            };

            this.put_editRateCard(rateCardObj, id);
        };

        aggrid_onCellValueChanged_rates(params: any) {
            const id = params.data.id;
            let active: boolean;
            let confirmed: boolean;

            if( params.data.active === 1 ) {
                active = true
            } else{
                active = false
            }

            if( params.data.confirmed === 1 ) {
                confirmed = true
            } else {
                confirmed = false
            }
            
            const ratesObj =  {
                ratecard_id: this.selectedRatecardId,
                prefix: params.data.prefix,
                destination: params.data.destination,
                active: active,
                sell_rate: parseFloat(params.data.sell_rate), 
                buy_rate: parseFloat(params.data.buy_rate),
                sell_rate_minimum: params.data.sell_rate_minimum,
                sell_rate_increment: params.data.sell_rate_increment,   
                buy_rate_minimum: params.data.buy_rate_minimum,
                buy_rate_increment: params.data.buy_rate_increment,
                confirmed: confirmed
            };
            console.log(ratesObj);
            this.put_editRates(ratesObj, id);
        }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */  
        /*
            ~~~~~ Rate cards ~~~~~
        */
        openDialogDel(): void {
            this.rateCardsSharedService.changeRowAllObj(this.rowRatecardObj);

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
        openDialogDetachTrunks(): void {
            this.rateCardsSharedService.changeRowAllObj(this.rowRatecardObj);
            this.rateCardsSharedService.changeRowTrunksObj(this.rowSelectionTrunks);

            const dialogRef = this.dialog.open(DetachTrunksComponent, {});

            const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
                this.aggrid_delRow(data);
            });

            dialogRef.afterClosed().subscribe(() => {
                sub.unsubscribe();
                console.log('The dialog was closed');
            });
        }

        openDialogAttachTrunks(): void {
            this.rateCardsSharedService.changeRowAllObj(this.rowRatecardObj);

            const dialogRef = this.dialog.open(AttachTrunksDialogComponent, {});

            const sub = dialogRef.componentInstance.event_onAdd.subscribe((data) => {
                // this.aggrid_addRow(data);
            });

            dialogRef.afterClosed().subscribe(() => {
                // sub.unsubscribe();
                console.log('The dialog was closed');
            });
        }
}
