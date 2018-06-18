import { Component, OnInit, ElementRef, Inject, Renderer, ViewChild } from '@angular/core';
import { GridApi, ColumnApi, ColumnGroup } from 'ag-grid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IsoCodesSharedService } from './../../shared/services/ratecard/iso-codes.shared.service';
import { RateCardsService } from './../../shared/api-services/ratecard/rate-cards.api.service';
import { MainTablePremSharedService } from './../../shared/services/ratecard/main-table-prem.shared.service';
import { MainTableCommonSharedService } from './../../shared/services/ratecard/main-table-common.shared.service';

@Component({
    selector: 'app-ratecard-view-carrier-p',
    templateUrl: './ratecard-view-carrier-p.component.html',
    styleUrls: ['./ratecard-view-carrier-p.component.scss']
})
export class RatecardViewCarrierPComponent implements OnInit {

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

    constructor(
        private _isoCodes: IsoCodesSharedService,
        private _rateCardsService: RateCardsService,
        private _mainTablePrem: MainTablePremSharedService,
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
                data => { this.processData(data); }
            );
    }

    get_everyCountryRates() {
        const countryArr = [];
        for ( let i = 0; i <= 240; i++ ) {
            this._rateCardsService.get_ratesByCountry(this.rowDataCountry[i].code)
                .subscribe(
                    (resp: Response) => {

                        // * doing some pre data filtering
                        const rowDataFilteredByTeleU = this.filterByTeleU(resp);
                        const rowDataFilteredByPremium = this.filterByPremium(rowDataFilteredByTeleU);
                        const rowDataFilteredForBlankRates = this._mainTableCommon.filterOutBlankArrays(rowDataFilteredByPremium, 'rates');

                        // * combine each result into a new array
                        for ( let x = 0; x < rowDataFilteredForBlankRates.length; x++ ) {
                            countryArr.push(rowDataFilteredForBlankRates[x]);
                        }

                        if (i >= 230 ) {
                            const hash = Object.create(null);
                            const result = countryArr.filter( (obj) => {
                                if (!hash[obj.carrier_id]) {
                                    hash[obj.carrier_id] = obj.rates;
                                    return true;
                                }
                                Array.prototype.push.apply(hash[obj.carrier_id], obj.rates);
                            });

                            const carrierGroupHeadersArr = this._mainTablePrem.createColumnGroupHeaders(result);
                            const columnDefsForMain = this._mainTablePrem.createCarrierColumnDefs(carrierGroupHeadersArr, result);
                    
                            this.columnDefsMain = this._mainTablePrem.createCarrierColumnDefs(carrierGroupHeadersArr, result);
                    
                            const finalRowData = this._mainTablePrem.createRowData(result);
                            this.gridApiMain.setRowData(finalRowData);
                    
                            this.setCarrierRowData(carrierGroupHeadersArr);
                        }
                    }
                )
        }
    }

    processData(rowData) {
        const rowDataFilteredByTeleU = this.filterByTeleU(rowData);
        const rowDataFilteredByPremium = this.filterByPremium(rowDataFilteredByTeleU);
        const rowDataFilteredForBlankRates = this._mainTableCommon.filterOutBlankArrays(rowDataFilteredByPremium, 'rates');

        const carrierGroupHeadersArr = this._mainTablePrem.createColumnGroupHeaders(rowDataFilteredForBlankRates);
        const columnDefsForMain = this._mainTablePrem.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFilteredForBlankRates);

        this.columnDefsMain = this._mainTablePrem.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFilteredForBlankRates);

        const finalRowData = this._mainTablePrem.createRowData(rowDataFilteredForBlankRates);
        this.gridApiMain.setRowData(finalRowData);

        this.setCarrierRowData(carrierGroupHeadersArr);
    }

    filterByTeleU = (array) => array.filter( (arrItem) => {
        const type = arrItem.ratecard_name.split('#')[2];
        if (type === 'teleU') {
            return type;
        }
    })

    filterByPremium = (array) => array.filter( (arrItem) => {
        if ( arrItem.ratecard_tier === 'premium') {
            return arrItem.ratecard_tier;
        }
    })

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

        if ( selectedCode === 'world') {
            this.get_everyCountryRates();
        } else {
            this.get_specificCarrierRatesByCountry(selectedCode);
        }
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

        };
        this.gridApiMain.exportDataAsCsv(exporterParams);
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
