import { Component, OnInit, ElementRef, Inject, Renderer, ViewChild } from '@angular/core';
import { GridApi, ColumnApi, ColumnGroup } from 'ag-grid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IsoCodesSharedService } from './../../shared/services/ratecard/iso-codes.shared.service';
import { RateCardsService } from './../../shared/api-services/ratecard/rate-cards.api.service';
import { MainTableStdSharedService } from './../../shared/services/ratecard/main-table-std.shared.service';
import { MainTableCommonSharedService } from './../../shared/services/ratecard/main-table-common.shared.service';

import { saveAs } from 'file-saver/FileSaver';

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

    booleanCountryCarrierSidebar = true;

    q = `Variance Flag, Destination, Prefix, Rate, *1, *2, *3, status, lowest, average, variance, low->high,  \n`;

    constructor(
        private _isoCodes: IsoCodesSharedService,
        private _rateCardsService: RateCardsService,
        private _mainTableStd: MainTableStdSharedService,
        @Inject(ElementRef) _elementRef: ElementRef,
        private _renderer: Renderer,
        public _dialog: MatDialog,
        private _mainTableCommon: MainTableCommonSharedService
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
                data => { this.processData(data); console.log(data); }
            );
    }

    // * service call to generate AZ ratecards
    get_specificCarrierRatesByCountryAZ(isoCode: string) {
        this._rateCardsService.get_ratesByCountry(isoCode)
            .subscribe(
                data => {
                    this.processData(data);
                    this.addCsvToVariable();
                }
            );
    }

    processData(rowData) {
        const rowDataFilteredByTeleU = this.filterByTeleU(rowData);
        const rowDataFilteredForStandard = this.filterByStandard(rowDataFilteredByTeleU);
        const rowDataFilteredForBlankRates = this._mainTableCommon.filterOutNoRates(rowDataFilteredForStandard);

        const carrierGroupHeadersArr = this._mainTableStd.createColumnGroupHeaders(rowDataFilteredForBlankRates);
        const columnDefsForMain = this._mainTableStd.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFilteredForBlankRates);

        this.columnDefsMain = this._mainTableStd.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFilteredForBlankRates);

        const finalRowData = this._mainTableStd.createRowData(rowDataFilteredForBlankRates);
        this.gridApiMain.setRowData(finalRowData);

        this.setCarrierRowData(carrierGroupHeadersArr);
    }

    filterByTeleU = (array) => array.filter( (arrItem) => {
        const type = arrItem.ratecard_name.split('#')[2];
        if (type === 'teleU') {
            return type;
        }
    })

    filterByStandard = (array) => array.filter( (arrItem) => {
        if ( arrItem.ratecard_tier === 'standard') {
            return arrItem.ratecard_tier;
        }
    })

    addCsvToVariable() {
        this.q += this.getDataAsCSV() + ', \n';
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
    onSelectionChangedCountry(params, callback) {
        const selectedCode = this.gridApiCountry.getSelectedRows()[0].code;
        this.gridApiMain.setRowData([]);
        this.get_specificCarrierRatesByCountry(selectedCode);
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
        const exporterParams = {
            columnKeys: ['destination', 'prefix', 'our_rate', 'our_rate_1p', 'our_rate_2p', 'our_rate_3p', 'lowest_rate',
                'average', 'variance', 'lowhigh'],
            skipHeader: true
        };
        this.gridApiMain.exportDataAsCsv(exporterParams);
    }

    click_exportAsAZCsv(getDataCallback, saveFileCallback) {
        this.exportAsAZCsv();
    }

    exportAsAZCsv() {
        const countryLen = this.rowDataCountry.length;

        for ( let i = 0; i < 241; i++ ) {
            this.get_specificCarrierRatesByCountryAZ(this.rowDataCountry[i].code);
        }
    }

    getDataAsCSV() {
        const exporterParams = {
            columnKeys: ['high_variance', 'destination', 'prefix', 'our_rate', 'our_rate_1p', 'our_rate_2p', 'our_rate_3p', 'status',
            'lowest_rate', 'average', 'variance', 'lowhigh'],
            skipHeader: true
        };
        return this.gridApiMain.getDataAsCsv(exporterParams);
    }

    /**
     * ? Test Function? How to trigger a callback when this.q variable contains the entire csv file
     */
    test() {
        this.saveToFileSystem(this.q, 'ObieTel_AZ_STD');
    }

    saveToFileSystem(csv, filenameinput) {
        const filename = filenameinput;
        const blob = new Blob([csv], { type: 'text/csv' });
        saveAs(blob, filename);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Top Toolbar - markup
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    onMarkupChange(params) {
        this.updateOurRateCol(params);
    }

    updateOurRateCol(currentSelectValue) {
        this.gridApiMain.forEachNode( (rowNode) => {
            const avgRate = this.gridApiMain.getValue('our_rate', rowNode);
            const ourRateAfterMarkup = avgRate * currentSelectValue;
            rowNode.setDataValue('our_rate', ourRateAfterMarkup.toFixed(4));
        });
    }
}
