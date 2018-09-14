import { Component, OnInit, ViewChild }    from '@angular/core'
import { GridApi, ColumnApi }              from 'ag-grid'
import { Observable }                      from 'rxjs'

import { RateCardManagerToolbarComponent } from './rate-card-manager-toolbar/rate-card-manager-toolbar.component'

import { RatecardCellComponent }           from './ratecard-cell/ratecard-cell.component'
import { RatecardHeaderComponent }          from './ratecard-header/ratecard-header.component'
import { RateTableModalComponent }         from './rate-table-modal/rate-table-modal.component'

import { ObietelCellComponent }            from './obie-cell/obie-cell.component'
import { ObieTableModalComponent }         from './obie-table-modal/obie-table-modal.component'
import { ObieHeaderComponent }             from './obie-header/obie-header.component'

import { RatecardManagerUtils }            from './../../../shared/utils/ratecard/rate-card-manager.utils'
import { RatecardManagerService }          from '../../../shared/api-services/ratecard/rate-card-manager.api.service'
import { CountryCodeRowDataSharedService } from './../../../shared/services/ratecard-manager/country-row-data.shared'
import * as _moment                        from 'moment'
@Component({
    selector: 'app-rate-card-manager',
    templateUrl: './rate-card-manager.component.html',
    styleUrls: ['./rate-card-manager.component.scss']
})
export class RateCardManagerComponent implements OnInit {

    @ViewChild(RateCardManagerToolbarComponent) private _rateTableToolbar: RateCardManagerToolbarComponent
    @ViewChild(RateTableModalComponent) private _rateTableModal: RateTableModalComponent
    @ViewChild(ObieTableModalComponent) private _obieTableModal: ObieTableModalComponent

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
    ratecardCellInfo
    obieCellInfo

    constructor(
        private _ratecardManagerUtils: RatecardManagerUtils,
        private _ratecardManagerService: RatecardManagerService,
        private _countryCodeRowDataSharedService: CountryCodeRowDataSharedService
    ) {
        this.columnDefs = this.createColumnDefs()
        this.context = {rateCardManagerTableComponent: this} // provides context of the carrier component to the cell components
        this.frameworkComponents = {
            _ratecardHeaderComponent: RatecardHeaderComponent,
            _ratecardCellComponent: RatecardCellComponent,
            _obietelCellComponent: ObietelCellComponent,
            _obieHeaderComponent: ObieHeaderComponent
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
    // * Event Handlers From Ratecard Cells
    // ================================================================================
    ratecardCellToggleHandler(cell: any, checkboxValue: boolean): void {
        const columnId = cell.colDef.field
        const rowNode = this.gridApi.getRowNode(cell.node.id)
        const originalData = cell.data
        this.ratecardCellToggleIsChecked(rowNode, originalData, columnId, checkboxValue)
    }

    ratecardCellToggleIsChecked(rowNode: any, originalData: any, colId: string, isChecked: boolean) {
        if (isChecked) {
            originalData[colId].isChecked = true
            this.ratecardCellIsCheckedOtherCols(originalData, colId)
            this.tellObieCellWhichRatecard(rowNode, originalData, colId)
         } else {
            originalData[colId].isChecked = false
            this.tellObieCellWhichRatecard(rowNode, originalData)
         } 
        rowNode.setData(originalData) // set new row data and refresh only this row
        this.gridApi.redrawRows(rowNode)
    }

    ratecardCellIsCheckedOtherCols(originalData: any, colId: string) {
        const ratecardCheckboxToDisable = Object.keys(originalData).filter( eaKey => {
            const colIdPattern = /([a-z]*)(\_)([a-z]*)(\_)([0-9]*)/g
            if(eaKey.match(colIdPattern) && eaKey !== colId) {
                return eaKey
            }
        })
        ratecardCheckboxToDisable.forEach( eaKey => {
            originalData[eaKey].isChecked = false
        })
    }

    tellObieCellWhichRatecard(rowNode: any, originalData: any, colId?: string) {
        // !@@@
        // For the future when we want to check for dups and obierate can match against all selected rates in arr
        // const checkDups = originalData.currentSelectedRatecard.some( eaRatecard => eaRatecard === colId ) // return false if no match is found, return true if dup is found
        // console.log(checkDups)
        colId ? originalData.currentSelectedRatecard = [colId] : originalData.currentSelectedRatecard = []
        rowNode.setData(originalData)
    }

    ratecardCellInfoHandler(cell: Object): void {
        // open a modal, set global var to cell obj which is later passed to modal via @Input
        this.ratecardCellInfo = cell
        this._rateTableModal.showModal()
    }

    // ================================================================================
    // * Event Handlers From Obie Cells
    // ================================================================================
    obieCellSwitchHandler(cell: any, toggleValue: boolean): void {
        const rowNode = this.gridApi.getRowNode(cell.node.id)
        const originalData = cell.data
        this.obieCellSwitchIsToggled(rowNode, originalData, toggleValue)
    }

    obieCellSwitchIsToggled(rowNode: any, originalData: any, isToggle: boolean) {
        isToggle ? originalData.isToggled = true : originalData.isToggled = false
        rowNode.setData(originalData) // set new row data and refresh only this row
        this.gridApi.redrawRows(rowNode)
    }

    obieCellRateInput(cell: any, rateValue: number): void {
        const rowNode = this.gridApi.getRowNode(cell.node.id)
        const originalData = cell.data
        originalData.customRate = rateValue
        rowNode.setData(originalData)
    }

    obieCellInfoHandler(cell: any): void {
        this.obieCellInfo = cell
        this._obieTableModal.showModal()
    }

    // ================================================================================
    // * Event Handlers From Headers
    // ================================================================================
    removeRatecardCol(headerField: string) {
        this.tableColDef = this.tableColDef.filter(eaCol => eaCol.field !== headerField) // filter out header field for both arrays containing col data
        this.ratecardColDefs = this.ratecardColDefs.filter(eaCol => eaCol.field !== headerField)

        this.tableRowData.forEach(eaRow => { delete eaRow[`${headerField}`]}) // remove key/value pair that matches headerField

        this.gridApi.setColumnDefs(this.tableColDef) // set column to the new col def

        this._rateTableToolbar.selectedValues.fromCarrierRatecardValue = null // triggers a call to child toolbar header to set from carreir ratecard value to []
    }

    toggleAllCountriesInCol(colId, val) {

        this.tableRowData.forEach( eaCountry => {
                if(Object.keys(eaCountry).length > 6) {
                    this.ratecardCellIsCheckedOtherCols(eaCountry, colId)
                }
            }
        )

        this.tableRowData.forEach(eaRow => {
            if(eaRow.hasOwnProperty(colId)) {
                eaRow[colId].isChecked = val
                val ? eaRow.currentSelectedRatecard = [colId] : eaRow.currentSelectedRatecard = []
            }
        })

        this.tableColDef.forEach( eaCol => {
            if(eaCol.colId === colId) {
                val ? eaCol.uiParameters.isHeaderChecked = true : eaCol.uiParameters.isHeaderChecked = false
            }
            else if ( eaCol.colId !== colId && eaCol.hasOwnProperty('uiParameters')) {
                eaCol.uiParameters.isHeaderChecked = false
            }
        })
        this.gridApi.refreshHeader()
        this.gridApi.redrawRows()
    }


    obieHeaderChangeMarkup(params: any, markupVal: number) {
        console.log(params)
        console.log(markupVal)
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
                cellRenderer: '_obietelCellComponent',
                headerComponent: '_obieHeaderComponent'
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

    onGridReady(params): void {
        this.gridApi = params.api
        this.columnApi = params.columnApi
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
                cellRenderer: '_ratecardCellComponent',
                headerComponent: '_ratecardHeaderComponent',
                uiParameters: {}
            })
            this.tableColDef = [].concat(countries, this.ratecardColDefs, obieRate)
        } else {
            alert('Ratecard is already in the Grid') // !@@@ alert is temp, provide a snackbar feedback later
            this._rateTableToolbar.selectDisabled.addDataToTableDisabled = true
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
                fixedMinimumRate: 2,
                previousRate: 2.5,
                markup: null,
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
            acc[cur.countries] = {                                // at the same time reduce to only the fields needed for ea cell
                fixedMinimumRate: cur.fixedMinimumRate,
                previousRate: cur.previousRate,
                markup: 1.02,
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

    save() {
        console.log(this.tableRowData)
        console.log(this.tableColDef)
    }
}

// ! @@@ how can reduce the length of this class?
// I can partition the ag grid related code to a helper file