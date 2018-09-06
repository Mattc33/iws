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
    ratecardRatesMean: number

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
    populateColRowData(): void {
        this.gridApi.setColumnDefs(this.createColumnDefs())

        const getRatecard = this.passObieCellInfo.data.currentSelectedRatecard[0]
        if (this.passObieCellInfo.data.hasOwnProperty(`${getRatecard}`)) {
            const getRates = this.passObieCellInfo.data[getRatecard].rates
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
                headerName: 'Rate', field: 'buy_rate', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Eff. Date', field: 'start_ts',
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
