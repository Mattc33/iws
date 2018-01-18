import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi } from 'ag-grid';

import { RatesService } from '../../services/rates.api.service';
import { RatesSharedService } from '../../services/rates.shared.service';

import { DeleteAllRatesDialogComponent } from './dialog/delete-rates-all/delete-rates-all-dialog.component';

@Component({
  selector: 'app-rates-table-all',
  templateUrl: './rates-table-all.component.html',
  styleUrls: ['./rates-table-all.component.scss']
})
export class RatesTableAllComponent implements OnInit {

    // Define row and column data
    private rowData;
    private columnDefs;

    private columnTypes;

    // AG grid props
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // Properties for internal service
    private rowSelection;
    private ratesRowObj;

    constructor(private ratesService: RatesService, private ratesSharedService: RatesSharedService,
    private dialog: MatDialog) {
        this.columnDefs = this.createColumnDefs();
        this.rowSelection = 'multiple';
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
        this.ratesService.get_Rates()
        .subscribe(
            data => { this.rowData = data; },
            error => { console.log(error); }
        );
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'All Rates',
                children: [
                    {
                        headerName: 'Rate Card Name', field: 'ratecard_name', checkboxSelection: true,
                        headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
                    },
                    {
                        headerName: 'Prefix', field: 'prefix', width: 100,
                        editable: true, filter: 'agNumberColumnFilter'
                    },
                    {
                        headerName: 'Destination', field: 'destination',
                        editable: true
                    },
                    {
                        headerName: 'Buy Rate', field: 'buy_rate', editable: true, filter: 'agNumberColumnFilter',
                        width: 150
                    },
                    {
                        headerName: 'Sell Rate', field: 'sell_rate', editable: true, filter: 'agNumberColumnFilter',
                        width: 150
                    },
                    {
                        headerName: 'Difference',
                        valueGetter: function(params) {
                          const diff = (params.data.sell_rate - params.data.buy_rate);
                          const percent = ((diff) / params.data.buy_rate) * 100;
                          const diffFixed = diff.toFixed(4);
                          const percentFixed = percent.toFixed(2);

                          return `${diffFixed}(${percentFixed}%)`;
                        }
                    },
                ]
            }
        ];
    }

    private createColumnDefsTeleU() {
        return [
            {
            headerName: 'Tele-U',
            children: [
                {
                    headerName: 'Prefix', field: 'prefix',
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Destination', field: 'destination',
                },
                {
                    headerName: 'Buy Rate', field: 'buy_rate',
                    editable: true,
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Sell Rate', field: 'sell_rate',
                    editable: true,
                    filter: 'agNumberColumnFilter'
                },
            ]
            }
        ];
    }

    // When width of parent (e) has been changed, fire this event to resize col
    on_GridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

    on_SelectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows();
        this.ratesRowObj = selectedRows;
        console.log(this.ratesRowObj);
    }

    aggrid_delRow(boolean) {
        if (boolean === true) {
            this.gridApi.updateRowData({ remove: this.ratesRowObj });
        } else {
            return;
        }
    }

    aggrid_onCellValueChanged(params: any) {
        const ratecard_id = params.data.ratecard_id;
        const id = params.data.id;
        const buy_rate = parseFloat(params.data.buy_rate);
        const sell_rate = parseFloat(params.data.sell_rate);
        const ratesObj = {
            ratecard_id: ratecard_id,
            buy_rate: buy_rate,
            sell_rate: sell_rate
        };

        console.log(ratesObj);
        this.put_editRateCard(id, ratesObj);
    }

    // call service to edit Rate Cards name
    put_editRateCard(id, ratesObj) {
        this.ratesService.put_Rates(id, ratesObj)
        .subscribe(resp => console.log(resp));
    }

    openDialogDel(): void {
      // assign new rowObj prop
      this.ratesSharedService.changeAllRowObj(this.ratesRowObj);

      const dialogRef = this.dialog.open(DeleteAllRatesDialogComponent, {});

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
