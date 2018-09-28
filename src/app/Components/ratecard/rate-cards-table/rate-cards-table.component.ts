import { Component, OnInit }                from '@angular/core'
import { MatDialog }                        from '@angular/material'
import { GridApi }                          from 'ag-grid'

import { DeleteRatesComponent }             from './dialog/delete-rates/delete-rates.component'
import { DeleteRateCardsDialogComponent }   from './dialog/delete-rate-cards/delete-rate-cards-dialog.component'
import { DetachTrunksComponent }            from './dialog/detach-trunks/detach-trunks.component'

import { NestedAgGridService }              from '../../../shared/services/global/nestedAgGrid.shared.service'
import { SnackbarSharedService }            from '../../../shared/services/global/snackbar.shared.service'
import { RateCardsService }                 from '../../../shared/api-services/ratecard/rate-cards.api.service'
import { RateCardsSharedService }           from '../../../shared/services/ratecard/rate-cards.shared.service'

@Component({
    selector: 'app-rate-cards-table',
    templateUrl: './rate-cards-table.component.html',
    styleUrls: ['./rate-cards-table.component.scss']
})
export class RateCardsTableComponent implements OnInit {

    //! AG Grid
    // * gridData
    rowData: Array<{}>
    columnDefs: Array<{}>
    columnDefsRates: Array<{}>
    columnDefsTrunks: Array<{}>

    // * gridApi & gridUI
    getNodeChildDetails: any
    gridApi: GridApi
    gridApiRates: GridApi
    gridApiTrunks: GridApi

    // Props for AG Grid
    rowSelectionTypeM = 'multiple'
    rowSelectionTypeS = 'single'
    rowSelectionAll
    rowSelectionRates
    rowSelectionTrunks
    isRowSelectable

    // Props for button toggle
    buttonToggleBoolean = true
    gridSelectionStatus: number
    buttonToggleBoolean_trunks = true
    gridSelectionStatus_trunks: number

    // ? Properties for internal service
    rowRatecardObj // ? Obj containing all selected Rows
    rowRatecardId // ? Selected Row's ratecard Id
    quickSearchValue = ''
    rowIdAll

    constructor(
        private rateCardsService: RateCardsService,
        private rateCardsSharedService: RateCardsSharedService,
        private nestedAgGridService: NestedAgGridService,
        private dialog: MatDialog,
        private _snackbar: SnackbarSharedService
    ) {
        this.columnDefs = this.createColumnDefs()
        this.columnDefsRates = this.createColumnDefsRates()
        this.columnDefsTrunks = this.createColumnsDefsTrunks()
    }

    ngOnInit() {
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups()
        this.getAllRatecards()
    }

    // ================================================================================
    // * Ratecard API Service
    // ================================================================================
    getAllRatecards(): void {
        this.rateCardsService.get_ratecard()
            .subscribe(
                ratecardData => {
                    console.log(ratecardData)
                    this.rowData = this.nestedAgGridService.formatDataToNestedArr(ratecardData)
                },
                error => console.log(error)
            )
    }

    get_specificRatecard(ratecardId: number): void {
        this.rateCardsService.get_ratesInRatecard(ratecardId)
            .subscribe(
                data => {
                    this.gridApiRates.updateRowData({ add: data })
                }
            )
    }

    get_specificTrunk(ratecardId: number): void {
        this.rateCardsService.get_specificRatecard(ratecardId)
            .subscribe (
                data => {
                    this.gridApiTrunks.updateRowData({ add: data.trunks })
                }
            )
    }

    put_editRateCard(rateCardObj: object, id: number) {
        this.rateCardsService.put_editRatecard(rateCardObj, id)
            .subscribe(
                resp => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbar.snackbar_success('Edit Successful', 2000)
                    }
                },
                error => {
                    console.log(error);
                    this._snackbar.snackbar_error('Edit Failed', 2000)
                }
            )
    }

    put_editRates(id: number, rateCardObj: object) {
        this.rateCardsService.put_EditRates(id, rateCardObj)
            .subscribe(
                resp => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this._snackbar.snackbar_success('Edit Successful', 2000)
                    }
                },
                error => {
                    console.log(error);
                    this._snackbar.snackbar_error('Edit Failed', 2000)
                }
            )
    }

    // ================================================================================
    // * AG Grid Init
    // ================================================================================
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
                headerName: 'Ratecard Group', field: 'ratecard_bundle',
                cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,
                width: 300, cellStyle: { 'border-right': '1px solid #E0E0E0' },
                sort: 'asc'
            },
            {
                headerName: 'Country', field: 'country', width: 180,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Date Added', editable: true, field: 'dateAdded', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', filter: 'agNumberColumnFilter', width: 60, editable: true,
                valueFormatter: function(params) {
                    return (params.value === 1 ) ? true : false
                },
                cellEditor: 'select', cellEditorParams: {values: [true, false]},
                hide: true
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
                headerName: 'Destination', field: 'destination', width: 300,
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
                    const diff = (params.data.sell_rate - params.data.buy_rate)
                    const percent = ((diff) / params.data.buy_rate) * 100
                    const diffFixed = diff.toFixed(4)
                    const percentFixed = percent.toFixed(2)
                    return `${diffFixed}(${percentFixed}%)`
                }, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', width: 100,
                valueFormatter: function(params) {
                    return (params.value === 1) ? true : false
                }
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
        ]
    }

    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
        gridSizeChanged(params): void {
            params.api.sizeColumnsToFit()
        }

        onQuickFilterChanged() { // external global search
            this.gridApi.setQuickFilter(this.quickSearchValue)
        }

        activeFilter(): void { // Trigger this to filter all disabled rows
            const activeFilterComponent = this.gridApi.getFilterInstance('active')
            activeFilterComponent.setModel({
                type: 'greaterThan',
                filter: 0
            })
            this.gridApi.onFilterChanged()
        }

        expandCollaspeHandler(e: boolean) {
            console.log(e);
            this.gridApi.forEachNode((node) => {
                if ( node.group) {
                    node.setExpanded(e)
                }
            })
        }

        /*
            ~~~~~ Selection ~~~~~
        */
        aggrid_selectionChanged(): void {
            this.gridApiRates.setRowData([])
            this.gridApiTrunks.setRowData([])
            this.rowRatecardObj = this.gridApi.getSelectedRows()
            this.rowRatecardId = this.rowRatecardObj[0].id

            if ( this.rowRatecardObj.length === 1 ) {
                this.get_specificRatecard(this.rowRatecardId)
                this.get_specificTrunk(this.rowRatecardId)
            }
        }

        aggrid_rates_selectionChanged(): void {
            this.rowSelectionRates = this.gridApiRates.getSelectedRows()
        }

        aggrid_trunks_selectionChanged(): void {
            this.rowSelectionTrunks = this.gridApiTrunks.getSelectedRows()
        }

        /*
            ~~~~~~~~~~ Button Toggle ~~~~~~~~~~
        */
        rowSelected() {
            this.gridSelectionStatus = this.gridApi.getSelectedNodes().length
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
                this.buttonToggleBoolean_trunks = false
            } else {
                this.buttonToggleBoolean_trunks = true
            }
            return this.buttonToggleBoolean_trunks
        }

        /*
            ~~~~~ Addition ~~~~~
        */
        aggrid_addRow(obj): void {
            this.gridApi.updateRowData({ add: [obj] })
        }

        aggrid_trunks_addRow(obj): void {
            this.gridApiTrunks.updateRowData({ add: [obj] })
        }

        /*
            ~~~~~ Edit ~~~~~
        */
        aggrid_onCellValueChanged(params: any) {
            const id = params.data.id
            const rateCardObj = {
                name: params.data.name,
                carrier_id: params.data.carrier_id,
                confirmed: JSON.parse(params.data.confirmed)
            };

            this.put_editRateCard(rateCardObj, id)
        }

        aggrid_onCellValueChanged_rates(params: any) {
            const id = params.data.id;
            let active: boolean;
            let confirmed: boolean;

            if ( params.data.active === 1 ) { active = true; }
            else if ( params.data.active === 0 ) { active = false; }

            if ( params.data.confirmed === 'true' ) { confirmed = true; }
            else if ( params.data.confirmed === 'false' ) { confirmed = false; }

            const ratesObj =  {
                ratecard_id: this.rowRatecardId,
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
            this.put_editRates(id, ratesObj);
        }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
        openDialogDelRatecard(): void {
            this.rateCardsSharedService.changeRowAllObj(this.rowRatecardObj);

            const dialogRef = this.dialog.open(DeleteRateCardsDialogComponent, {});

            dialogRef.afterClosed().subscribe(() => {
                this.getAllRatecards();
            });
        }

        openDialogDelRates(): void {
            this.rateCardsSharedService.changeRowRatesObj(this.rowSelectionRates);

            const dialogRef = this.dialog.open(DeleteRatesComponent, {});

            const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
            })

            dialogRef.afterClosed().subscribe(() => {
                sub.unsubscribe();
            })
        }

        /*
            ~~~~~ Trunks ~~~~~
        */
        openDialogDetachTrunks(): void {
            this.rateCardsSharedService.changeRowAllObj(this.rowRatecardObj);
            this.rateCardsSharedService.changeRowTrunksObj(this.rowSelectionTrunks);

            const dialogRef = this.dialog.open(DetachTrunksComponent, {});

            const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
            })

            dialogRef.afterClosed().subscribe(() => {
                sub.unsubscribe();
            })
        }

}
