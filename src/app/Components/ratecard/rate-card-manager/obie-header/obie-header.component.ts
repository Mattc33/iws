import { Component } from '@angular/core'
import { IHeaderAngularComp } from 'ag-grid-angular'
@Component({
  selector: 'app-obie-header',
  templateUrl: './obie-header.component.html',
  styleUrls: ['./obie-header.component.scss']
})
export class ObieHeaderComponent implements IHeaderAngularComp {

    public params: any
    obieRatePercent: number
    public obieRatePercentDisabled = true

    constructor() { }

    agInit(params: any): void {
        this.params = params
        this.populateStringInterpolationValues(params)
    }

    populateStringInterpolationValues = (params: any) => {
        const tableRowData = params.context.rateCardManagerTableComponent.tableRowData.filter( eaCountry => 
            eaCountry.hasOwnProperty('currentSelectedRatecard') && eaCountry.currentSelectedRatecard.length > 0
        )
        if (tableRowData.length > 0) {
            this.obieRatePercent = tableRowData[0].markUp
            this.obieRatePercentDisabled = false
        }
    }

    formatRateToPercent = (value: number = 0) => `${value} %`

    // ================================================================================
    // * Child To Parent Event Handlers
    // ================================================================================
    public changeObiePercentValue(markupVal: number): void {
        if(typeof markupVal === 'string') {
            markupVal = parseFloat(markupVal)
        }
        this.params.context.rateCardManagerTableComponent 
            .obieHeaderChangeMarkup(markupVal)
    }



}
