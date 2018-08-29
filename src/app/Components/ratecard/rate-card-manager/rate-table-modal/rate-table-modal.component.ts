import { Component, Input } from '@angular/core'
import { GridApi } from 'ag-grid'

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
    ratecardName: string

    // ! AG Grid
    // * gridApi
    gridApi: GridApi

    // ! Service Call
    ratecardId: number
    carrierId: number

    constructor(
    ) {

    }

    // ================================================================================
    // * Event Handlers Modal
    // ================================================================================
    nzAfterOpen(): void {
        // ? initiate some variables after Modal opens
        this.ratecardName = this.passCarrierCellInfo.colDef.headerName;
        console.log('init', this.ratecardName)

        // ? populate Col and Row data
        this.gridApi.setColumnDefs(this.createColumnDefs())
        const columnId = this.passCarrierCellInfo.colDef.field
        this.gridApi.setRowData(this.passCarrierCellInfo.data[`${columnId}`].rates)
    }

    showModal(): void {
        this.isVisible = true
    }

    handleOk(): void {
        console.log('Modal Button Ok')
        this.isVisible = false
    }

    // ================================================================================
    // * AG Grid
    // ================================================================================
    createColumnDefs(): Array<{}> {
        const commonCellStyle = { 'border-right': '1px solid #ccc' };
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
                headerName: 'Status', field: 'status', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Eff. Date', field: 'start_ts',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                valueFormatter: function(params) {
                    return _moment(params.value).format('MMMM Do, YYYY')
                },
            }
        ];
    }

    createRowData(): Array<{}> {
        return []
    }

    onGridReady(params): void {
        this.gridApi = params.api
        this.gridApi.setRowData(this.createRowData())
        params.api.sizeColumnsToFit()
    }

    gridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }


}
