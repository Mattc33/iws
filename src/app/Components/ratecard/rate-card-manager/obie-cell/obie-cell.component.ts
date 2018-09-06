import { Component } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'

@Component({
  selector: 'app-obietel-cell',
  templateUrl: './obie-cell.component.html',
  styleUrls: ['./obie-cell.component.scss']
})
export class ObietelCellComponent implements ICellRendererAngularComp {
    public params: any
    uiDisabled = true

    // ! ui values
    switchValue = false
    rateValue = 0.0

    rateInputDisabled = true

    constructor() { }

    agInit = (params: any): void => {
        this.params = params
        this.parseData(params)
    }

    // ================================================================================
    // * Get/Set Data
    // ================================================================================
    parseData(params) {
        const numberOfRatecards = Object.keys(params.data).length
        if ( numberOfRatecards >= 6 ) {
            this.uiDisabled = !this.uiDisabled
        } 
    }

    // ================================================================================
    // * Child To Parent Event Handlers
    // ================================================================================
    public switchChangeHandler(value: boolean): void {
        (value) ? this.rateInputDisabled = false : this.rateInputDisabled = true

        this.params.ComponentFixture
            .rateCardManagerTableComponent
            .obieCellToggleHandler(this.params, value)
    }

    public openObieCellModal(): void {
        this.params.context
            .rateCardManagerTableComponent
            .obieCellInfoHandler(this.params) // when opening modal pass the checked off value that comes from parent
    }

    refresh = (): boolean => true

}
