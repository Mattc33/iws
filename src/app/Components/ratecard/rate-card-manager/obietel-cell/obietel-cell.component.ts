import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-obietel-cell',
  templateUrl: './obietel-cell.component.html',
  styleUrls: ['./obietel-cell.component.scss']
})
export class ObietelCellComponent implements ICellRendererAngularComp {
    public params: any;
    rateValue = 0.0;
    rateInputDisabled = true;

    constructor() { }

    agInit = (params: any): void => {
        this.params = params;
    }

    public switchChangeHandler(value: boolean): void {
        console.log(value);
        if (value) {
            this.rateInputDisabled = false;
        } else {
            this.rateInputDisabled = true;
        }
    }

    // another event handler to change prefix inside obieratecard for country
    // based on a user input
    public openObieCellModal(): void {
        this.params.context
            .rateCardManagerTableComponent
            .obieCellInfoHandler(this.params);
    }

    refresh = (): boolean => true;

}
