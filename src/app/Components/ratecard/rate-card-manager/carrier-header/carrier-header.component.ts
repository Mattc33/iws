import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import * as _moment from 'moment'

@Component({
  selector: 'app-carrier-header',
  templateUrl: './carrier-header.component.html',
  styleUrls: ['./carrier-header.component.scss']
})
export class CarrierHeaderComponent implements IHeaderAngularComp {
    public params: any

    // ! string interpolation values
    headerName: string
    headerDate: string

    constructor() { }

    agInit(params: any): void {
        this.params = params
        this.initiateStringInterpolationValues()
    }

    initiateStringInterpolationValues(): void {
        const split = this.params.displayName.split('_')
        this.headerName = split[0]
        this.headerDate = _moment.unix(split[1]).format('MMMM Do, YYYY')
    }

}
