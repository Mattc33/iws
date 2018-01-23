import { RateCardsService } from './../../../rate-cards/services/rate-cards.api.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi } from 'ag-grid';

import { RatesService } from '../../services/rates.api.service';
import { RatesSharedService } from '../../services/rates.shared.service';

import { DeleteTeleuRatesDialogComponent } from '../rates-table-tele-u/dialog/delete-rates-teleu/delete-rates-teleu-dialog.component';

@Component({
  selector: 'app-rates-table-tele-u',
  templateUrl: './rates-table-tele-u.component.html',
  styleUrls: ['./rates-table-tele-u.component.scss']
})
export class RatesTableTeleUComponent implements OnInit {

    // Define row and column data
    private rowDataU;
    private columnDefsU;

    private columnTypes;

    // AG grid props
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // Properties for internal service
    private rowSelection;
    private rowID: number;
    private ratesRowObj: object;
    private teleuRateCardId = 28;

    constructor(private ratesService: RatesService, private ratesSharedService: RatesSharedService,
    private dialog: MatDialog) {
        this.columnDefsU = this.createColumnDefs();
        this.rowSelection = 'single';
    }

    ngOnInit() {
        this.on_InitializeRows();
    }

    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    }

    on_InitializeRows(): void {
        this.ratesService.get_TeleURates()
        .subscribe(
            data => { this.rowDataU = data; },
            error => { console.log(error); }
        );
    }

    private createColumnDefs() {
        return [
            {
            headerName: 'Tele-U',
            children: [
                {
                    headerName: 'Prefix', field: 'prefix',  width: 150,
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Destination', field: 'destination',
                },
                {
                    headerName: 'Buy Rate', field: 'buy_rate', width: 150,
                    editable: true,
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Sell Rate', field: 'sell_rate', width: 150,
                    editable: true,
                    filter: 'agNumberColumnFilter'
                },
            ]
            }
        ];
    }

    // When width of parent (e) has been changed, fire this event to resize col
    on_GridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    on_SelectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows();

        this.ratesRowObj = [{ id: selectedRows[0].id, ratecard_id: this.teleuRateCardId }];
        console.log(this.ratesRowObj);
    }

    aggrid_delRow(boolean) {
        if (boolean === true) {
            this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
        } else {
            return;
        }
    }

    aggrid_onCellValueChanged(params: any) {
        const ratecard_id = this.teleuRateCardId; // hard coded value for tele-u ratecard
        const id = params.data.id;
        const buy_rate = parseFloat(params.data.buy_rate);
        const ratesObj = {
            buy_rate: buy_rate,
            sell_rate: params.data.sell_rate
        };

        this.put_editRateCard(id, ratesObj);
    }

    // call service to edit Rates
    put_editRateCard(id, ratesObj) {
        this.ratesService.put_Rates(id, ratesObj)
        .subscribe(resp => console.log(resp));
    }

    openDialogDel(): void {
        // assign new rowObj prop
        this.ratesSharedService.changeAllRowObj(this.ratesRowObj);

        const dialogRef = this.dialog.open(DeleteTeleuRatesDialogComponent, {});

        const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
            // do something with event data
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    } // end openDialogAdd UploadRatesDialog

}
