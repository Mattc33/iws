import { Component, OnInit, ViewChild } from '@angular/core'
import { GridApi, ColumnApi } from 'ag-grid'
import { Observable } from 'rxjs';

import { CarrierCellComponent } from './carrier-cell/carrier-cell.component'
import { ObietelCellComponent } from './obietel-cell/obietel-cell.component'
import { RateTableModalComponent } from './rate-table-modal/rate-table-modal.component'
import { RatecardManagerUtils } from './../../../shared/utils/ratecard/rate-card-manager.utils';
import { RatecardManagerService } from '../../../shared/api-services/ratecard/rate-card-manager.api.service';

@Component({
    selector: 'app-rate-card-manager',
    templateUrl: './rate-card-manager.component.html',
    styleUrls: ['./rate-card-manager.component.scss']
})
export class RateCardManagerComponent implements OnInit {

    @ViewChild(RateTableModalComponent) _rateTableModal: RateTableModalComponent

    // ! AG Grid
    // * row data and column definitions
    rowData: Array<any>
    columnDefs: Array<{}>

    // * gridApi
    gridApi: GridApi
    columnApi: ColumnApi

    // * gridUI props
    context: object
    frameworkComponents: object

    // ! Holds Ratecard Col Defs
    ratecardColDefs: Array<any> = []

    // ! Passed to Modal
    carrierCellInfo

    constructor(
        private _ratecardManagerUtils: RatecardManagerUtils,
        private _ratecardManagerService: RatecardManagerService
    ) {
        this.columnDefs = this.createColumnDefs();
        this.context = {rateCardManagerTableComponent: this} // provides context of the carrier component to the cell components
        this.frameworkComponents = {
            _carrierCellComponent: CarrierCellComponent,
            _obietelCellComponent: ObietelCellComponent
        };
    }

    ngOnInit() {
    }

    // ================================================================================
    // * Service
    // ================================================================================
    getRatecardRates = (carrierId: number, ratecardId: number): Observable<any> => {
        return this._ratecardManagerService.get_ratecardRates(carrierId, ratecardId)
    }
    
 
    postCarrierListToProfile = (): void  => {

    }

    postCarrierRatesInfoToProfile = (): void  => {

    }


    // ================================================================================
    // * Event Handlers from Top Toolbar
    // ================================================================================
    addRatecardAsCol(ratecardList: Array<any>): void { // * responsible for adding the right carriers as cols to grid
        this.updateColDefs(ratecardList)
        const formattedRatecardList = ratecardList.map(eaRatecard => {
            return {
                countries: eaRatecard.country,
                ratecardId: eaRatecard.ratecard_id,
                carrierId: eaRatecard.carrierId,
                rates: [],
                minRate: 0,
                maxRate: 0,
                finalRate: 3,
                fixedMinimumRate: 2,
                previousRate: 2.5
            }
        })
        formattedRatecardList.forEach(eaRatecard => {
            this.getRatecardRates(eaRatecard.carrierId, eaRatecard.ratecardId)
                .subscribe( rates => {
                    const getRateAsArr = rates[Object.keys(rates)[0]]
                    eaRatecard.rates = getRateAsArr
                    eaRatecard.minRate = this._ratecardManagerUtils.getMinRate(getRateAsArr)
                    eaRatecard.maxRate = this._ratecardManagerUtils.getMaxRate(getRateAsArr)
                })
            this.gridApi.updateRowData( { add: [eaRatecard] })
        })
    }

    // ================================================================================
    // * Event Handlers From Cells
    // ================================================================================
    fromCarrierCellToggleHandler(cell: Object, checkboxValue: boolean): void {
        console.log(cell)
        console.log(checkboxValue)
    }

    fromCarrierCellInfoHandler(cell: Object): void {
        // open a modal, set global var to cell obj which is later passed to modal via @Input
        console.log(cell)
        this.carrierCellInfo = cell
        this._rateTableModal.showModal()
    }

    obieCellInfoHandler(cell: Object): void {
        console.log('obie info', cell)
        this.carrierCellInfo = cell
        this._rateTableModal.showModal()
    }

    // ================================================================================
    // * AG Grid
    // ================================================================================
    // ? Grid Initiation
    createColumnDefs(): Array<{}> {
        const commonCellStyle = { 'border-right': '1px solid #ccc', 'line-height': '70px',
        'text-align': 'center' }

        return [
            {
                headerName: 'Countries', field: 'countries', colId: 'countries', width: 120,
                cellStyle: { 'border-right': '1px solid #000', 'line-height': '70px',
                'font-weight': 'bold' },
            },
            {
                headerName: 'Obie Rate', field: 'finalRate', colId: 'finalRate', width: 210,
                cellStyle: { 'border-right': '1px solid #E0E0E0', 'border-left': '1px solid #000' },
                cellRenderer: '_obietelCellComponent'
            },
            {
                headerName: 'Min Rate', field: 'fixedMinimumRate', colId: 'fixedMinimumRate',
                width: 120,
                cellStyle: commonCellStyle,
            },
            {
                headerName: 'Prev Rate', field: 'previousRate', colId: 'previousRate',
                width: 120,
                cellStyle: commonCellStyle,
            }
        ];
    }

    createRowData(): Array<any> {
        return []
    }

    onGridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        // params.api.sizeColumnsToFit();
        this.gridApi.setRowData(this.createRowData())
    }

    updateColDefs(ratecardList: object): void {
        const unix = ratecardList[0].groupId.split('_')[1]
        const date = this._ratecardManagerUtils.unixToLocalTime(unix)
        const ratecardName = `${ratecardList[0].groupId.split('_')[0]} ${date}`
        const countries = [this.columnDefs[0]]
        this.ratecardColDefs.push({
            headerName: ratecardName,
            colId: ratecardList[0].groupId,
            width: 260, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            cellRenderer: '_carrierCellComponent'
        })
        const obieRate = this.columnDefs.slice(1)
        this.gridApi.setColumnDefs([].concat(countries, this.ratecardColDefs, obieRate))
    }
}
