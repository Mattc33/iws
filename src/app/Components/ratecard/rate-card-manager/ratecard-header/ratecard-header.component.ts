import { RateCardManagerComponent } from './../rate-card-manager.component';
import { Component } from '@angular/core'
import { IHeaderAngularComp } from 'ag-grid-angular'
import * as _moment from 'moment'

@Component({
  selector: 'app-carrier-header',
  templateUrl: './ratecard-header.component.html',
  styleUrls: ['./ratecard-header.component.scss']
})
export class RatecardHeaderComponent implements IHeaderAngularComp {
    public params: any

    // ! string interpolation values
    headerName: string
    headerDate: string
    checked: boolean

    constructor() { }

    agInit(params: any): void {
        this.params = params
        this.initiateStringInterpolationValues()
        
        if (params.column.colDef.uiParameters.hasOwnProperty('isHeaderChecked')) {
            params.column.colDef.uiParameters.isHeaderChecked ? this.checked = true : this.checked = false
        }
    }

    initiateStringInterpolationValues(): void {
        const split = this.params.displayName.split('_')
        this.headerName = split[0]
        this.headerDate = _moment.unix(split[1]).format('MMMM Do, YYYY')
    }

    // ================================================================================
    // * Child To Parent Event Handlers
    // ================================================================================
    public removeCol(): void {
        this.params.context.rateCardManagerTableComponent
            .removeRatecardCol(this.params.column.colDef.field)
    }

    public toggleAllCountries(val: boolean): void {
        this.params.context.rateCardManagerTableComponent
            .toggleAllCountriesInCol(this.params.column.colId, val)
    }

}
