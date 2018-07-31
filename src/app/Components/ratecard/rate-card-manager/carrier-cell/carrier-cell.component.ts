import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-carrier-cell',
  templateUrl: './carrier-cell.component.html',
  styleUrls: ['./carrier-cell.component.scss']
})
export class CarrierCellComponent implements ICellRendererAngularComp {
    public params: any;
    checked = false;

    constructor() { }

    agInit(params: any): void { // initialization life cycle hook for AG Grid Cells
        this.params = params;
    }

    public toggleCarrier(value: boolean): void {
        // exposed method for parent component
        // params will be an AG grid obj passsed to this child cell render component
        // you will then access context which is a var set equal to <this> aka parent component
        this.params.context
            .rateCardManagerTableComponent
            .fromCarrierCellToggleHandler(this.params, value); // `Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`
    }

    public openCarrierCellModal(): void {
        this.params.context
            .rateCardManagerTableComponent
            .fromCarrierCellInfoHandler(this.params);
    }

    refresh = (): boolean => true; // AG Grid Cells life cycle hook on cell refresh

}

// ! example: https://www.ag-grid.com/javascript-grid-cell-rendering-components/
