import { Component } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'

@Component({
  selector: 'app-ratecard-cell',
  templateUrl: './ratecard-cell.component.html',
  styleUrls: ['./ratecard-cell.component.scss']
})
export class RatecardCellComponent implements ICellRendererAngularComp {
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
        this.parseDataForStringInterpolation(params)
        this.shouldCheckboxBeChecked(params)
    }

    // ================================================================================
    // * Get/Set Data
    // ================================================================================
    parseDataForStringInterpolation(params: any): void {
        const columnId = params.colDef.field
        if ( params.data.hasOwnProperty(`${columnId}`)) {
            this.uiDisabled = !this.uiDisabled
            this.minRate = params.data[`${columnId}`].minRate
            this.maxRate = params.data[`${columnId}`].maxRate
            this.effDate = params.data[`${columnId}`].date
        }
    }

    shouldCheckboxBeChecked(params: any): void {
        const columnId = params.colDef.field
        if ( params.data.hasOwnProperty(`${columnId}`)) {
            const isChecked = params.data[`${columnId}`].isChecked
            isChecked ? this.checked = true : this.checked = false
        }
    }

    // ================================================================================
    // * Child To Parent Event Handlers
    // ================================================================================
    public toggleRatecard(value: boolean): void {
        // exposed method for parent component
        // params will be an AG grid obj passsed to this child cell render component
        // you will then access context which is a var set equal to <this> aka parent component
        this.params.context
            .rateCardManagerTableComponent
            .ratecardCellToggleHandler(this.params, value) // `Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`
    }

    public openRatecardCellModal(): void {
        this.params.context
            .rateCardManagerTableComponent
            .ratecardCellInfoHandler(this.params)
    }

    // ================================================================================
    // * Parent To Child Event Handlers
    // ================================================================================
    toggleCheckbox() {
        this.checked = !this.checked
    }

    refresh = (): boolean => true // AG Grid Cells life cycle hook on cell refresh
}

// ! example: https://www.ag-grid.com/javascript-grid-cell-rendering-components/
