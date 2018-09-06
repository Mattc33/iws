import { Component, OnInit, ViewChild } from '@angular/core'
import { GridApi, ColumnApi } from 'ag-grid'
import { Observable } from 'rxjs';

import { CarrierCellComponent } from './carrier-cell/carrier-cell.component'
import { ObietelCellComponent } from './obietel-cell/obietel-cell.component'
import { CarrierHeaderComponent } from './carrier-header/carrier-header.component'
import { RateTableModalComponent } from './rate-table-modal/rate-table-modal.component'
import { RatecardManagerUtils } from './../../../shared/utils/ratecard/rate-card-manager.utils'
import { RatecardManagerService } from '../../../shared/api-services/ratecard/rate-card-manager.api.service'
import { CountryCodeRowDataSharedService } from './../../../shared/services/ratecard-manager/country-row-data.shared'
import { RateCardManagerToolbarComponent } from './rate-card-manager-toolbar/rate-card-manager-toolbar.component'
import * as _moment from 'moment'
@Component({
    selector: 'app-rate-card-manager',
    templateUrl: './rate-card-manager.component.html',
    styleUrls: ['./rate-card-manager.component.scss']
})
export class RateCardManagerComponent implements OnInit {

    @ViewChild(RateTableModalComponent) private _rateTableModal: RateTableModalComponent
    @ViewChild(RateCardManagerToolbarComponent) private _rateTableToolbar: RateCardManagerToolbarComponent

    // ! AG Grid
    // * row data and column definitions
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
        const columnId = cell['colDef'].field
        if (checkboxValue) {
            this.changeIsChecked(cell['data'].countries, columnId, true) 

            console.log(cell)
        } else {
            this.changeIsChecked(cell['data'].countries, columnId, false)
        }

        

        // ? on check=true find the correct rate table for the cell
        // ? when obie-cell info btn is clicked a new component modal is formed

        // ? on the init phase of the new obie-cell info modal
        // ? a row-field will be updated to reflect the selected rate table for that row
        // ? The modal component will know from that string which rate table to find in the row obj
        // ? that row obj will become the rowData for that obie-cell


    }

    changeIsChecked(country: string, colId: string, isChecked: boolean): void {
        const countryMatch = country
            this.tableRowData.map( eaCountry => {
                if (eaCountry.countries === countryMatch) {
                    isChecked ? eaCountry[`${colId}`].isChecked = true : eaCountry[`${colId}`].isChecked = false
                }
            })
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
    // * Event Handlers From Headers
    // ================================================================================
    fromCarrierRemoveCol(headerField: string) {
        this.tableColDef = this.tableColDef.filter(eaCol => eaCol.field !== headerField) // filter out header field for both arrays containing col data
        this.ratecardColDefs = this.ratecardColDefs.filter(eaCol => eaCol.field !== headerField)

        this.tableRowData.forEach(eaRow => { delete eaRow[`${headerField}`]}) // remove key/value pair that matches headerField

        this.gridApi.setColumnDefs(this.tableColDef) // set column to the new col def

        this._rateTableToolbar.fromCarrierRatecardValue = null // triggers a call to child toolbar header to set from carreir ratecard value to []
    }

    // ================================================================================
    // * AG Grid
    // ================================================================================
    createColumnDefs(): Array<{}> {
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
        const checkDups = this.ratecardColDefs.some( eaCol => ratecardList[0].colId === eaCol.field) // return false if no match is found, return true if dup is found

        if(!checkDups) {
            this.ratecardColDefs.push({
                headerName: ratecardName,
                field: ratecardList[0].colId,
                colId: ratecardList[0].colId,
                width: 240, cellStyle: { 'border-right': '1px solid #E0E0E0' },
                cellRenderer: '_carrierCellComponent',
                headerComponent: '_carrierHeaderComponent'
            })
            this.tableColDef = [].concat(countries, this.ratecardColDefs, obieRate)
        } else {
            alert('Ratecard is already in the Grid') // !@@@ alert is temp, provide a snackbar feedback later
            this._rateTableToolbar.addDataToTableDisabled = true
        }
    }

    displayEffDate(ratesInRatecardArr: Array<any>): string {
        const isUnique = ratesInRatecardArr
            .map( eaItem => eaItem.start_ts)
            .filter( (value, index, self) => self.indexOf(value) === index)
        return ( isUnique.length > 1) ? 'Varied Effective Date' : _moment(ratesInRatecardArr[0].start_ts).format('MMMM Do, YYYY')
    }

    updateRowData(ratecardList) {
        const formattedRatecardList = ratecardList.map(eaRatecard => { // remap into new row data
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
        formattedRatecardList.forEach(eaRatecard => { // for each ratecard call api and insert rate data
            this.getRatecardRates(eaRatecard.carrierId, eaRatecard.ratecardId) // GET, feeding in ea carrierId, ratecardId
                .subscribe( eaCountry => { 
                    const getEaCountryAsArr = eaCountry[Object.keys(eaCountry)[0]]
                    const colGroup = eaRatecard.colId
                    eaRatecard[`${colGroup}`].rates = getEaCountryAsArr
                    eaRatecard[`${colGroup}`].minRate = this._ratecardManagerUtils.getMinRate(getEaCountryAsArr)
                    eaRatecard[`${colGroup}`].maxRate = this._ratecardManagerUtils.getMaxRate(getEaCountryAsArr)
                    eaRatecard[`${colGroup}`].date = this.displayEffDate(getEaCountryAsArr)
                    eaRatecard[`${colGroup}`].isChecked = false
                })
        })
        
        const lookup = formattedRatecardList.reduce( (acc, cur) => { // create a hash to figure out which country to insert data into, 
            acc[cur.countries] = {                                   // at the same time reduce to only the fields needed for ea cell
                finalRate: cur.finalRate,
                fixedMinimumRate: cur.fixedMinimumRate,
                previousRate: cur.previousRate,
                currentSelectedRatecard: [],
                [`${cur.colId}`]: cur[`${cur.colId}`]
            }
            return acc
        }, {})

        const insert = this.tableRowData.map( eaCountry => { // if countries field match merge objects else return
            const match = lookup[eaCountry.countries]
            if (match) {
                Object.assign(eaCountry, match)
            }
            return eaCountry
        })

        this.tableRowData = insert
    }
}
