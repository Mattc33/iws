import { Component, Input } from '@angular/core'
import { GridApi, ColumnApi } from 'ag-grid'
import * as _moment from 'moment'
@Component({
  selector: 'app-obie-table-modal',
  templateUrl: './obie-table-modal.component.html',
  styleUrls: ['./obie-table-modal.component.scss']
})
export class ObieTableModalComponent {

    @Input() passObieCellInfo: any

    // ! Modal
    isVisible = false

    // ! String interpolation values
    ratecardName: string
    currentDate: string
    ratecardCountry: string
    ratecardPrefixAmount: number
    ratecardPercentMarkup: string

    // ! AG Grid
    // * gridApi
    gridApi: GridApi
    columnApi: ColumnApi

    constructor() { }

    // ================================================================================
    // * Event Handlers Modal
    // ================================================================================
    nzAfterOpen(): void {
        // ? initiate some variables after Modal opens
        this.applyStringInterpolationDataHeader()

        // ? populate Col and Row data
        this.populateColRowData()
    }

    showModal(): void {
        this.isVisible = true
    }

    handleOk(): void {
        this.isVisible = false
    }

    handleCancel(): void {
        this.isVisible = false
    }

    // ================================================================================
    // * Modal Data
    // ================================================================================
    applyStringInterpolationDataHeader(): void {
        const params = this.passObieCellInfo
        this.ratecardName = params.data.currentSelectedRatecard[0]
        this.currentDate = _moment().format('MMMM Do, YYYY')
        this.ratecardCountry = params.data.countries
    }

    applyStringInterpolationDataFooter(): void {
        const params = this.passObieCellInfo
        this.ratecardPrefixAmount = params.data[`${params.colDef.field}`].rates.length

    }

    populateColRowData(): void {
        this.gridApi.setColumnDefs(this.createColumnDefs())
        const getRatecard = this.passObieCellInfo.data.currentSelectedRatecard[0]
        const rowData = this.passObieCellInfo.data
        if (rowData.hasOwnProperty(`${getRatecard}`)) {
            let getRates
            if (rowData.isToggled && rowData.customRate > 0) {
                rowData[getRatecard].rates.forEach(eaRate => {
                    eaRate.customRate = rowData.customRate
                })
                getRates = rowData[getRatecard].rates
            } else {
                getRates = rowData[getRatecard].rates
            }
            this.gridApi.setRowData(getRates)
        } else {
            this.gridApi.setRowData([])
        }
    }

    // ================================================================================
    // * AG Grid
    // ================================================================================
    createColumnDefs(): Array<{}> {
        return [
            {
                headerName: 'Prefix', field: 'prefix', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination', field: 'destination',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'BRate', field: 'buy_rate', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'SRate', field: 'buy_rate', width: 100,
                editable: true,
                cellStyle: params => {
                    if ( params.data.hasOwnProperty('customRate')) {
                        return { 'border-right': '1px solid #E0E0E0', 'text-decoration': 'line-through' }
                    } else {
                        return { 'border-right': '1px solid #E0E0E0' }
                    }
                },
                valueFormatter: params => params.value * 1.02
            },
            {
                headerName: 'CustomRate', field: 'customRate', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                editable: true,
            },
            {
                headerName: 'Eff. Date', field: 'start_ts', width: 140,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                valueFormatter: params => _moment(params.value).format('MMMM Do, YYYY'),
            }
        ]
    }

    onGridReady(params): void {
        this.gridApi = params.api
        this.columnApi = params.ColumnApi
    }

    onRowDataChanged(params) { // resize cols on load
        params.api.sizeColumnsToFit()
    }

    onGridSizeChanged(params) { // resize cols on screen adjust
        params.api.sizeColumnsToFit()
    }

}
