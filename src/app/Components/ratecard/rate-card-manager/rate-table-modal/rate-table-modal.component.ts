import { Component, Input } from '@angular/core'
import { GridApi, ColumnApi } from 'ag-grid'
import { MainTableCommonSharedService } from './../../../../shared/services/ratecard/main-table-common.shared.service'
import * as _moment from 'moment'
@Component({
  selector: 'app-rate-table-modal',
  templateUrl: './rate-table-modal.component.html',
  styleUrls: ['./rate-table-modal.component.scss']
})
export class RateTableModalComponent {

    @Input() passCarrierCellInfo: any

    // ! Modal
    isVisible = false

    // ! String interpolation values
    ratecardName: string
    ratecardDate: string
    ratecardCountry: string
    ratecardPrefixAmount: number
    ratecardRatesMean: number

    // ! AG Grid
    // * gridApi
    gridApi: GridApi
    columnApi: ColumnApi
    
    constructor(
        private _mainTableCommonSharedService: MainTableCommonSharedService
    ) {

    }

    // ================================================================================
    // * Event Handlers Modal
    // ================================================================================
    nzAfterOpen(): void {
        // ? initiate some variables after Modal opens
        this.applyStringInterpolationDataHeader()
        this.applyStringInterpolationDataFooter()

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
        const params = this.passCarrierCellInfo
        this.ratecardName = params.colDef.headerName.split('_')[0]
        this.ratecardDate = _moment.unix(params.colDef.headerName.split('_')[1]).format('MMMM Do, YYYY')
        this.ratecardCountry = params.data.countries
    }

    applyStringInterpolationDataFooter(): void {
        const params = this.passCarrierCellInfo
        this.ratecardPrefixAmount = params.data[`${params.colDef.field}`].rates.length
        this.ratecardRatesMean = this._mainTableCommonSharedService.returnMean(
            (params.data[`${params.colDef.field}`].rates).map( eaPrefix => eaPrefix.buy_rate)
        ).toFixed(4)
    }

    populateColRowData(): void {
        this.gridApi.setColumnDefs(this.createColumnDefs())
        const columnId = this.passCarrierCellInfo.colDef.field
        this.gridApi.setRowData(this.passCarrierCellInfo.data[`${columnId}`].rates)
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
