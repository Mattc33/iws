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

    constructor() { }

    agInit(params: any): void {
        this.params = params
    }

    formatRateToPercent = (value: number = 0) => `${value} %`

    // ================================================================================
    // * Child To Parent Event Handlers
    // ================================================================================
    public changeObiePercentValue(markupVal: number): void {
        if(typeof markupVal === 'string') {
            markupVal = parseFloat(markupVal)
        }
        this.obieRatePercent = markupVal
            this.params.context 
                .rateCardManagerTableComponent 
                .obieHeaderChangeMarkup(markupVal)
    }



}
