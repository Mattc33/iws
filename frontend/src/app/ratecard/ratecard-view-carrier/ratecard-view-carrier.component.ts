import { Component, OnInit, ElementRef, Inject, Renderer, ViewChild } from '@angular/core';
import { GridApi, ColumnApi, ColumnGroup } from 'ag-grid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IsoCodesSharedService } from './../../shared/services/ratecard/iso-codes.shared.service';
import { RateCardsService } from './../../shared/api-services/ratecard/rate-cards.api.service';
import { MainTableSharedService } from './../../shared/services/ratecard/main-table.shared.service';

@Component({
  selector: 'app-ratecard-view-carrier',
  templateUrl: './ratecard-view-carrier.component.html',
  styleUrls: ['./ratecard-view-carrier.component.scss']
})
export class RatecardViewCarrierComponent implements OnInit {

    public _elementRef: ElementRef;

    // row data and column defs
    rowDataMain; columnDefsMain;
    rowDataCountry; columnDefsCountry;
    columnDefsCarrier;

    // gridApi
    private gridApiMain: GridApi; public columnApiMain: ColumnApi;
    private gridApiCountry: GridApi;
    private gridApiCarrier: GridApi;

    // gridUi
    rowSelectionM = 'multiple';
    rowSelectionS = 'single';
    private howManyCarriers: number;

    booleanCountryCarrierSidebar = true;

    constructor(
        private _isoCodes: IsoCodesSharedService,
        private _rateCardsService: RateCardsService,
        private _mainTable: MainTableSharedService,
        @Inject(ElementRef) _elementRef: ElementRef,
        private _renderer: Renderer,
        public _dialog: MatDialog
    ) {
        this.columnDefsCountry = this.createColumnDefsCountry();
        this.columnDefsCarrier = this.createColumnDefsCarrier();
    }

    ngOnInit() {
        this.rowDataCountry = this._isoCodes.getCountryCodes();
    }

    // ================================================================================
    // Carrier-View API Services
    // ================================================================================
    get_specificCarrierRatesByCountry(isoCode: string) {
        this._rateCardsService.get_ratesByCountry(isoCode)
            .subscribe(
                data => {
                    console.log(data);
                    this.processData(data);
                }
            );
    }

    processData(rowData) {
        const rowDataFiltered = [];
        for (let i = 0; i < rowData.length; i++) {
            console.log(rowData[i].rates);
            if (rowData[i].rates.length > 0) {
                rowDataFiltered.push(rowData[i]);
            }
        }

        const carrierGroupHeadersArr = this._mainTable.createColumnGroupHeaders(rowDataFiltered);
        this.howManyCarriers = carrierGroupHeadersArr.length;

        const columnDefsForMain = this._mainTable.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFiltered);

        this.columnDefsMain = this._mainTable.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFiltered);

        const finalRowData = this._mainTable.createRowData(rowDataFiltered);
        this.gridApiMain.setRowData(finalRowData);

        this.setCarrierRowData(carrierGroupHeadersArr);
    }

    // ================================================================================
    // AG Grid Init
    // ================================================================================
    on_GridReady(params): void {
        this.gridApiMain = params.api;
        this.columnApiMain = params.columnApi;
        this.gridApiMain.setGroupHeaderHeight(50);
    }

    on_GridReady_country(params): void {
        this.gridApiCountry = params.api;
        params.api.sizeColumnsToFit();
        this.gridApiCountry.selectIndex(0, true, null);
    }

    on_GridReady_carrier(params): void {
        this.gridApiCarrier = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefsCountry() {
        return [
            {
                headerName: 'Country', field: 'country', checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                unSortIcon: true,
            },
            {
                headerName: 'Code', field: 'code', hide: true, unSortIcon: true,
            }
        ];
    }

    private createColumnDefsCarrier() {
        return [
            {
                headerName: 'Carriers', field: 'ratecard_name_modified', colId: 'carrierToggle',
                checkboxSelection: true, headerCheckboxSelection: true, unSortIcon: true,
            }
        ];
    }

    setCarrierRowData(rowData: Array<[{}]>) {
        this.gridApiCarrier.setRowData(rowData);
        this.gridApiCarrier.selectAll();
    }

    // ================================================================================
    // AG Grid shared Fn
    // ================================================================================
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    // ================================================================================
    // AG Grid Country Table
    // ================================================================================
    onSelectionChangedCountry(params) {
        const selectedCode = this.gridApiCountry.getSelectedRows()[0].code;
        this.gridApiMain.setRowData([]);
        this.get_specificCarrierRatesByCountry(selectedCode);
        // this.mockdata_get_specificCarrierRatesByCountry(selectedCode); // API Call
        // this.selectedCountryName = this.gridApiCountry.getSelectedRows()[0].country; // Set country name to selected country
    }

    // ================================================================================
    // AG Grid Carrier Table
    // ================================================================================
    rowSelectedCarrier(params) {
        this.detectColVisibility(params.node.selected, params.data.colId);
    }

    // ================================================================================
    // Top toolbar
    // ===============================================================================
    toggleCountryCarrierSidebar() {
        this.booleanCountryCarrierSidebar = !this.booleanCountryCarrierSidebar;
    }

    // ================================================================================
    // AG Grid Main Table - Header - Assigning Events
    // ================================================================================
    // onColumnVisible(params) { // On column reappears after hiding
    //     // this.assignEventHandler(this.getCurrentlyViewableColumns());
    // }

    // onNewColumnsLoaded(params) { // On any new columns loaded into grid
    //     // this.assignEventHandler(this.getCurrentlyViewableColumns());
    // }

    // getCurrentlyViewableColumns(): Array<['']> {
    //     const viewableColArr = [];
    //     for ( let i = 0; i < this.howManyCarriers; i++ ) {
    //         const getPrefixCol = this.columnApiMain.getColumn(`carrier_${i}`).isVisible();
    //         if ( getPrefixCol === true ) {
    //             viewableColArr.push(`${i}`);
    //         }
    //     }
    //     console.log(viewableColArr);
    //     return viewableColArr;
    // }

    // assignEventHandler(viewableColArr: Array<['']>) {
    //     for ( let i = 0; i < viewableColArr.length; i++ ) {
    //         const colId = viewableColArr[i];
    //         const hideCol = this._elementRef.nativeElement.querySelector(`#hide_${colId}`);
    //         const e_hideCol = this._renderer.listen(hideCol, 'click', (event) => {
    //              this.deselectCarrierTableCheckbox(event, `${colId}`);
    //         });
    //     }
    // }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Header - Hide
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    deselectCarrierTableCheckbox(event, id) {
        const rowNode = this.gridApiCarrier.getRowNode(id);
        rowNode.setSelected(false);
    }

    detectColVisibility(condition: boolean, colId: string) {
        if ( condition === true ) {
            this.showCol(`carrier_rate_${colId}`);
            this.showCol(`carrier_dest_${colId}`);
        }
        if ( condition === false ) {
            this.hideCol(`carrier_rate_${colId}`);
            this.hideCol(`carrier_dest_${colId}`);
        }
    }

    hideCol(colId: string) {
        this.columnApiMain.setColumnVisible(colId, false);
    }

    showCol(colId: string) {
        this.columnApiMain.setColumnVisible(colId, true);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Export
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    exportAsCsv() {
        this.gridApiMain.exportDataAsCsv();
    }

}
