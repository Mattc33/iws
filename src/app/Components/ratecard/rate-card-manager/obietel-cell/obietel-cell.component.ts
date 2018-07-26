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

    agInit = (): void => {

    }

    public switchChangeHandler(value: boolean): void {
        console.log(value);
        if (value) {
            this.rateInputDisabled = false;
        } else {
            this.rateInputDisabled = true;
        }
    }

    refresh = (): boolean => true;

}
