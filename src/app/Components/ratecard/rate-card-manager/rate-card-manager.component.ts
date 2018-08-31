import { Component, OnInit, ViewChild } from '@angular/core'
import { GridApi, ColumnApi } from 'ag-grid'
import { Observable } from 'rxjs';

import { CarrierCellComponent } from './carrier-cell/carrier-cell.component'
import { ObietelCellComponent } from './obietel-cell/obietel-cell.component'
import { CarrierHeaderComponent } from './carrier-header/carrier-header.component'
import { RateTableModalComponent } from './rate-table-modal/rate-table-modal.component'
import { RatecardManagerUtils } from './../../../shared/utils/ratecard/rate-card-manager.utils'
import { RatecardManagerService } from '../../../shared/api-services/ratecard/rate-card-manager.api.service'
import { CountryCodeRowDataSharedService } from './../../../shared/services/ratecard-manager/country-row-data.shared';
import * as _moment from 'moment'
@Component({
    selector: 'app-rate-card-manager',
    templateUrl: './rate-card-manager.component.html',
    styleUrls: ['./rate-card-manager.component.scss']
})
export class RateCardManagerComponent implements OnInit {

    @ViewChild(RateTableModalComponent) private _rateTableModal: RateTableModalComponent

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

    // ! Holds Grid Info
    ratecardColDefs: Array<any> = []
    tableColDef: Array<any> = []
    tableRowData: Array<any> = []

    // ! Passed to Modal 
    carrierCellInfo

    constructor(
        private _ratecardManagerUtils: RatecardManagerUtils,
        private _ratecardManagerService: RatecardManagerService,
        private _countryCodeRowDataSharedService: CountryCodeRowDataSharedService
    ) {
        this.columnDefs = this.createColumnDefs()
        this.context = {rateCardManagerTableComponent: this} // provides context of the carrier component to the cell components
        this.frameworkComponents = {
            _carrierCellComponent: CarrierCellComponent,
            _obietelCellComponent: ObietelCellComponent,
            _carrierHeaderComponent: CarrierHeaderComponent
        }
    }

    ngOnInit() {
        this.tableRowData = this._countryCodeRowDataSharedService.getCountryCodeRowData()
    }

    // ================================================================================
    // * Service
    // ================================================================================
    getRatecardRates = (carrierId: number, ratecardId: number): Observable<any> => {
        return this._ratecardManagerService.get_ratecardRates(carrierId, ratecardId)
    }

    // ================================================================================
    // * Event Handlers from Top Toolbar
    // ================================================================================
    addRatecardData(ratecardList: Array<any>): void { // * responsible for adding carriers as rows/cols to grid
        const insertColumnId = ratecardList.map( eaRatecard => {
            eaRatecard.colId = eaRatecard.groupId.replace(/\s/g, "").replace ('-', '_')
            return eaRatecard
        })

        this.updateColDefs(insertColumnId)
        this.updateRowData(insertColumnId)
    }

    addRatecardDataToTable() {
        this.gridApi.setColumnDefs(this.tableColDef)
        this.gridApi.setRowData(this.tableRowData)
    }

    // ================================================================================
    // * Event Handlers From Cells
    // ================================================================================
    fromCarrierCellToggleHandler(cell: Object, checkboxValue: boolean): void {
    }

    fromCarrierCellInfoHandler(cell: Object): void {
        // open a modal, set global var to cell obj which is later passed to modal via @Input
        this.carrierCellInfo = cell
        this._rateTableModal.showModal()
    }

    obieCellInfoHandler(cell: Object): void {
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
                headerName: 'Countries', field: 'countries', colId: 'countries', width: 140,
                cellStyle: { 'border-right': '1px solid #000', 'line-height': '70px',
                'font-weight': 'bold' }, 
            },
            {
                headerName: 'Obie Rate', field: 'finalRate', colId: 'finalRate', width: 220,
                cellStyle: { 'border-right': '1px solid #E0E0E0', 'border-left': '1px solid #000' },
                cellRenderer: '_obietelCellComponent'
            },
            // {
            //     headerName: 'Min Rate', field: 'fixedMinimumRate', colId: 'fixedMinimumRate',
            //     width: 120,
            //     cellStyle: commonCellStyle,
            // },
            // {
            //     headerName: 'Prev Rate', field: 'previousRate', colId: 'previousRate',
            //     width: 120,
            //     cellStyle: commonCellStyle,
            // }
        ]
    }

    createRowData(): Array<any> {
        return []
    }

    onGridReady(params): void {
        this.gridApi = params.api
        this.columnApi = params.columnApi
        // params.api.sizeColumnsToFit()
        this.gridApi.setRowData(this.createRowData())
    }

    updateColDefs(ratecardList: any): void {
        const ratecardName = `${ratecardList[0].groupId}`
        const countries = [this.columnDefs[0]]
        const obieRate = this.columnDefs.slice(1)
        this.ratecardColDefs.push({
            headerName: ratecardName,
            field: ratecardList[0].colId,
            colId: ratecardList[0].colId,
            width: 240, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            cellRenderer: '_carrierCellComponent',
            headerComponent: '_carrierHeaderComponent'
        })

        this.tableColDef = [].concat(countries, this.ratecardColDefs, obieRate)
    }

    displayEffDate(ratesInRatecardArr: Array<any>): string {
        const isUnique = ratesInRatecardArr
            .map( eaItem => eaItem.start_ts)
            .filter( (value, index, self) => self.indexOf(value) === index)
        return ( isUnique.length > 1) ? 'Varied Effective Date' : _moment(ratesInRatecardArr[0].start_ts).format('MMMM Do, YYYY')
    }

    updateRowData(ratecardList) {
        const formattedRatecardList = ratecardList.map(eaRatecard => {
            return {
                countries: eaRatecard.country,
                ratecardId: eaRatecard.ratecard_id,
                carrierId: eaRatecard.carrierId,
                colId: eaRatecard.colId,
                finalRate: 3,
                fixedMinimumRate: 2,
                previousRate: 2.5,
                [`${eaRatecard.colId}`]: {}
            }
        })
        formattedRatecardList.forEach(eaRatecard => {
            this.getRatecardRates(eaRatecard.carrierId, eaRatecard.ratecardId) // GET, feeding in ea carrierId, ratecardId
                .subscribe( eaCountry => { 
                    const getEaCountryAsArr = eaCountry[Object.keys(eaCountry)[0]]
                    const colGroup = eaRatecard.colId
                    eaRatecard[`${colGroup}`].rates = getEaCountryAsArr
                    eaRatecard[`${colGroup}`].minRate = this._ratecardManagerUtils.getMinRate(getEaCountryAsArr)
                    eaRatecard[`${colGroup}`].maxRate = this._ratecardManagerUtils.getMaxRate(getEaCountryAsArr)
                    eaRatecard[`${colGroup}`].date = this.displayEffDate(getEaCountryAsArr)
                })
        })
        
        const lookup = formattedRatecardList.reduce( (acc, cur) => {
            acc[cur.countries] = {
                finalRate: cur.finalRate,
                fixedMinimumRate: cur.fixedMinimumRate,
                previousRate: cur.previousRate,
                [`${cur.colId}`]: cur[`${cur.colId}`]
            }
            return acc
        }, {})

        const insert = this.tableRowData.map( eaCountry => {
            const match = lookup[eaCountry.countries]
            if (match) {
                Object.assign(eaCountry, match)
            }
            return eaCountry
        })

        this.tableRowData = insert
    }

    // ================================================================================
    // * Test Methods
    // ================================================================================
    selectAllCheckBox() {
        
    }

}
