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

    // ! string interpolation 
    ratecardName: string = 'No ratecard selected'

    // ! switch values
    switchValue = false

    // ! input values
    rateValue: number
    rateInputDisabled = true

    constructor() { }

    agInit = (params: any): void => {
        if(this.shouldCellBeShown(params)) {
            this.params = params
            this.provideStringInterpolationValues(params)
            this.shouldToggleBeToggled(params)
            this.shouldInputBeToggled()
        }
    }

    // ================================================================================
    // * Get/Set Data
    // ================================================================================
    shouldCellBeShown(params: any): boolean {
        const numberOfRatecards = Object.keys(params.data).length
        if ( numberOfRatecards >= 5 ) {
            this.uiDisabled = !this.uiDisabled
            return true
        } else {
            return false
        }
    }

    provideStringInterpolationValues(params: any): void {
        this.rateValue = params.data.customRate
        if(params.data.hasOwnProperty('currentSelectedRatecard')) {
            if(params.data.currentSelectedRatecard.length > 0) {
                const ratecardName = params.data.currentSelectedRatecard[0].split('_')
                ratecardName.pop()
                this.ratecardName = ratecardName.join(' - ')
            }
        }

    }

    shouldToggleBeToggled(params: any): void {
        params.data.isToggled ? this.switchValue = true : this.switchValue = false
    }

    shouldInputBeToggled(): void {
        this.switchValue ? this.rateInputDisabled = false : this.rateInputDisabled = true
    }

    // ================================================================================
    // * Child To Parent Event Handlers
    // ================================================================================
    public switchChangeHandler(toggleValue: boolean): void {
        this.params.context
            .rateCardManagerTableComponent
            .obieCellSwitchHandler(this.params, toggleValue, this.rateValue)
    }

    public openObieCellModal(): void {
        this.params.context
            .rateCardManagerTableComponent
            .obieCellInfoHandler(this.params) // when opening modal pass the checked off value that comes from parent
    }

    public changeRateInputValue(rateValue: number): void {
        this.params.context 
            .rateCardManagerTableComponent
            .obieCellRateInput(this.params, rateValue)
    }

    refresh = (): boolean => true

}
