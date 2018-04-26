import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi } from 'ag-grid';

import { DeleteRatesComponent } from './dialog/delete-rates/delete-rates.component';
import { DeleteRateCardsDialogComponent } from './dialog/delete-rate-cards/delete-rate-cards-dialog.component';
import { DetachTrunksComponent } from './dialog/detach-trunks/detach-trunks.component';

import { NestedAgGridService } from './../../global-service/nestedAgGrid.shared.service';
import { RateCardsService } from '../services/rate-cards.api.service';
import { RateCardsSharedService } from '../services/rate-cards.shared.service';

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
    private getNodeChildDetails;
    private columnDefsRates;
    private columnDefsTrunks;

    // AG grid props
    private gridApi: GridApi;
    private gridApiRates: GridApi;
    private gridApiTrunks: GridApi;

    // Props for AG Grid
    private rowSelectionTypeM = 'multiple';
    private rowSelectionTypeS = 'single';
    private rowSelectionAll;
    private rowSelectionRates;
    private rowSelectionTrunks;
    private isRowSelectable;

    // Props for button toggle
    private buttonToggleBoolean = true;
    private gridSelectionStatus: number;
    private buttonToggleBoolean_trunks = true;
    private gridSelectionStatus_trunks: number;

    // Properties for internal service
    private rowRatecardObj;
    private quickSearchValue = '';
    private rowIdAll;
    private selectedRatecardId: number;

    constructor(
        private rateCardsService: RateCardsService,
        private rateCardsSharedService: RateCardsSharedService,
        private nestedAgGridService: NestedAgGridService,
        private dialog: MatDialog
    ) {
        this.columnDefs = this.createColumnDefs();
        this.columnDefsRates = this.createColumnDefsRates();
        this.columnDefsTrunks = this.createColumnsDefsTrunks();

    }

    ngOnInit() {
        this.getNodeChildDetails = this.setGroups();
        this.on_InitializeRows();
    }

    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    on_InitializeRows(): void {
        this.rateCardsService.get_RateCard()
            .subscribe(
                data => {
                    // pass json to internal service to return formatted obj
                    this.rowData = this.nestedAgGridService.formatDataToNestedArr(data);
                },
                error => console.log(error)
            );
    }

    put_editRateCard(rateCardObj: object, id: number) {
        this.rateCardsService.put_EditRateCard(rateCardObj, id)
            .subscribe(resp => console.log(resp));
    }

    put_editRates(id: number, rateCardObj: object) {
        this.rateCardsService.put_EditRates(id, rateCardObj)
            .subscribe(resp => console.log(resp));
    }

    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_Rates(params): void {
        this.gridApiRates = params.api;
        params.api.sizeColumnsToFit();
    }

    on_GridReady_Trunks(params): void {
        this.gridApiTrunks = params.api;
        params.api.sizeColumnsToFit();

    }

    private createColumnDefs() {
        return [
            {
                headerName: 'RateCard Group', field: 'ratecard_bundle',
                cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,
                width: 300, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country', width: 180,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Approve?', editable: true, field: 'confirmed', width: 100,
                valueFormatter: function(params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: {values: [true, false]},
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', filter: 'agNumberColumnFilter', hide: true, width: 100,
            }
        ];
    }

    private createColumnDefsRates() {
        return [
            {
                headerName: 'Prefix', field: 'prefix',
                checkboxSelection: true, headerCheckboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination', field: 'destination', width: 400,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Rate', field: 'buy_rate', editable: true,
                filter: 'agNumberColumnFilter', width: 150,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Rate', field: 'sell_rate', editable: true,
                filter: 'agNumberColumnFilter', width: 150,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Difference',
                valueGetter: function(params) {
                    const diff = (params.data.sell_rate - params.data.buy_rate);
                    const percent = ((diff) / params.data.buy_rate) * 100;
                    const diffFixed = diff.toFixed(4);
                    const percentFixed = percent.toFixed(2);

                    return `${diffFixed}(${percentFixed}%)`;
                }, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Approved?', field: 'confirmed', editable: true,
                cellEditor: 'select', cellEditorParams: {values: [ true, false]},
                valueFormatter: function(params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                }, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', editable: true, width: 100,
                cellEditor: 'select', cellEditorParams: {values: [ true, false]}, hide: true,
            }
        ];
    }

    private createColumnsDefsTrunks() {
        return [
            {
                headerName: 'Trunk Id', field: 'cx_trunk_id',
                checkboxSelection: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Meta Data', field: 'metadata',
            }
        ];
    }

    setGroups() {
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

    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
        gridSizeChanged(params) {
            params.api.sizeColumnsToFit();
        }

        onQuickFilterChanged() { // external global search
            this.gridApi.setQuickFilter(this.quickSearchValue);
        }

        activeFilter(): void { // Trigger this to filter all disabled rows
            const activeFilterComponent = this.gridApi.getFilterInstance('active');
            activeFilterComponent.setModel({
                type: 'greaterThan',
                filter: 0
            });
            this.gridApi.onFilterChanged();
        }

        expandAll(expand: boolean) {
            this.gridApi.forEachNode((node) => {
                if ( node.group) {
                    node.setExpanded(expand);
                }
            });
        }

        /*
            ~~~~~ Selection ~~~~~
        */
        aggrid_selectionChanged(): void {
            this.gridApiRates.setRowData([]);
            this.gridApiTrunks.setRowData([]);

            this.rowRatecardObj = this.gridApi.getSelectedRows();
            this.selectedRatecardId = this.rowRatecardObj[0].id;

            // UPDATE THIS SECTION
            // These need to be in their own function
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
        }

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
            if (string === 'delete-ratecards') {
                this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
            }
            if (string === 'delete-rates') {
                this.gridApiRates.updateRowData({ remove: this.gridApiRates.getSelectedRows() });
            }
            if (string === 'delete-trunks') {
                this.gridApiTrunks.updateRowData({ remove: this.gridApiTrunks.getSelectedRows() });
            } else {
                return;
            }
        }

        /*
            ~~~~~ Addition ~~~~~
        */
        aggrid_addRow(obj): void {
            this.gridApi.updateRowData({ add: [obj] });
        }

        aggrid_trunks_addRow(obj): void {
            this.gridApiTrunks.updateRowData({ add: [obj] });
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
        }

        aggrid_onCellValueChanged_rates(params: any) {
            const id = params.data.id;
            let active: boolean;
            let confirmed: boolean;

            if ( params.data.active === 1 ) {
                active = true;
            } else {
                active = false;
            }

            if ( params.data.confirmed === 1 ) {
                confirmed = true;
            } else {
                confirmed = false;
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
            this.put_editRates(id, ratesObj);
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
            });
        }

}
