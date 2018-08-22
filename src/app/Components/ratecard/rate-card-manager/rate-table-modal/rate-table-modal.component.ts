import { Component, Input } from '@angular/core';
import { GridApi } from 'ag-grid';

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

    // ================================================================================
    // * Event Handlers Modal
    // ================================================================================
    nzAfterOpen(): void {
        // ? initiate some variables after Modal opens
        this.ratecardName = this.passCarrierCellInfo.colDef.headerName;
        console.log('init', this.ratecardName)

        // ? populate Col and Row data
        this.gridApi.setColumnDefs(this.createColumnDefs())
        this.gridApi.setRowData(this.passCarrierCellInfo.data.rates)
    }

    showModal(): void {
        this.isVisible = true
    }

    handleOk(): void {
        console.log('Modal Button Ok')
        this.isVisible = false
    }

    handleCancel(): void {
        console.log('Modal Button Cancel')
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
            },
            {
                headerName: 'Destination', field: 'destination'
            },
            {
                headerName: 'Rate', field: 'buy_rate', width: 100,
            },
            {
                headerName: 'Status', field: 'status', width: 100,
            },
            {
                headerName: 'Eff. Date', field: 'date'
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
