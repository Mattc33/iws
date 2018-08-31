import { Component } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'

@Component({
  selector: 'app-carrier-cell',
  templateUrl: './carrier-cell.component.html',
  styleUrls: ['./carrier-cell.component.scss']
})
export class CarrierCellComponent implements ICellRendererAngularComp {
    public params: any
    checked = false
    uiDisabled = true

    // ! string interpolation values
    minRate: number
    maxRate: number
    effDate: string

    constructor(
    ) { }

    agInit(params: any): void { // initialization life cycle hook for AG Grid Cells
        this.params = params
        this.partitionDataForStringInterpolation(params)
    }

    // ================================================================================
    // * Get Data
    // ================================================================================
    partitionDataForStringInterpolation(params: any) {
        console.log(params)
        const columnId = params.colDef.field
        // console.log(params.data)
        
        if ( params.data.hasOwnProperty(`${columnId}`)) {
            this.uiDisabled = !this.uiDisabled
            this.minRate = params.data[`${columnId}`].minRate
            this.maxRate = params.data[`${columnId}`].maxRate
            this.effDate = params.data[`${columnId}`].date
        }
    }

    // ================================================================================
    // * Child To Parent Event Handlers
    // ================================================================================
    public toggleCarrier(value: boolean): void {
        // exposed method for parent component
        // params will be an AG grid obj passsed to this child cell render component
        // you will then access context which is a var set equal to <this> aka parent component
        this.params.context
            .rateCardManagerTableComponent
            .fromCarrierCellToggleHandler(this.params, value) // `Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`
    }

    public openCarrierCellModal(): void {
        this.params.context
            .rateCardManagerTableComponent
            .fromCarrierCellInfoHandler(this.params)
    }

    // ================================================================================
    // * Parent To Child Event Handlers
    // ================================================================================
    toggleCheckbox() {
        this.checked = !this.checked
    }

    refresh(): boolean {  // AG Grid Cells life cycle hook on cell refresh
        return true
    }
}

// ! example: https://www.ag-grid.com/javascript-grid-cell-rendering-components/
