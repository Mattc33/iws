import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridApi } from 'ag-grid';
import { PapaParseService } from 'ngx-papaparse';
import { saveAs } from 'file-saver/FileSaver';

import { NestedAgGridService } from './../../../../global-service/nestedAgGrid.shared.service';
import { RateCardsService } from './../../../services/rate-cards.api.service';
import { RateCardsTableComponent } from './../../rate-cards-table.component';

@Component({
  selector: 'app-csv-converter',
  templateUrl: './csv-converter.component.html',
  styleUrls: ['./csv-converter.component.scss']
})
export class CsvConverterComponent implements OnInit {

    private rowData;
    private columnDefs;

    private gridApi: GridApi;

    private rowSelectionTypeM = 'multiple';
    private getNodeChildDetails;

    private currentSelectedRows;

    private download: string;

    constructor(
        public dialogRef: MatDialogRef <RateCardsTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private rateCardsService: RateCardsService,
        private nestedAgGridService: NestedAgGridService,
        private papa: PapaParseService
    ) {
        this.getNodeChildDetails = this.setGroups();
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_ratecards();
    }

    // ================================================================================
    // Ratecard API Service
    // ================================================================================
    get_ratecards(): void {
        this.rateCardsService.get_RateCard().subscribe(
            data => {
                this.rowData = this.nestedAgGridService.formatDataToNestedArr(data);
            },
            error => { console.log(error); },
        );
    }

    get_specificRatecard(ratecard_id: number, fileName: string): void {
        this.rateCardsService.get_RatesInRatecard(ratecard_id)
        .subscribe(
            data => {
                console.log(data);
                const csv = this.papaUnparse(data);
                this.saveToFileSystem(csv, fileName);
            }
        );
    }

    // ================================================================================
    // AG Grid Initiation
    // ================================================================================
    on_GridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    private setGroups() {
        return function getNodeChildDetails(rowItem) {
            if (rowItem.children) {
                return {
                    group: true,
                    children: rowItem.children,
                    key: rowItem.ratecard_bundle
                };
            } else {
                return null;
            }
        };
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'RateCard Group', field: 'ratecard_bundle',
                cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,
                width: 300, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country', width: 180,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Approve?', editable: true, field: 'confirmed', width: 100,
                valueFormatter: function(params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: {values: [true, false]},
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', filter: 'agNumberColumnFilter', hide: true, width: 100,
            }
        ];
    }

    // ================================================================================
    // AG Grid events
    // ================================================================================
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    rowSelected(params) {
        this.currentSelectedRows = this.gridApi.getSelectedRows();
    }

    // ================================================================================
    // CSV conversion
    // ================================================================================
    onConvertJsonToCsv(): void {
        for ( let i = 0; i < this.currentSelectedRows.length; i++ ) {
            const eachRatecard = this.currentSelectedRows[i].id;
            const fileName = this.getSelectedFileNames(i);
            this.get_specificRatecard(eachRatecard, fileName);
        }
    }

    getSelectedFileNames(id): string {
        const ratecard_name = this.gridApi.getSelectedRows()[id].ratecard_bundle;
        const country = this.gridApi.getSelectedRows()[id].country;
        const carrier = this.gridApi.getSelectedRows()[id].carrier_name;
        const currentTime = Date.now();
        const fileName = `${ratecard_name}_${country}_${carrier}_${currentTime}`.replace(/\s/g, '');
        return fileName;
    }

    papaUnparse(json): string {
        const config = {
            header: false,
        };
        const fields = [ 'prefix', 'destination', 'sell_rate', 'sell_rate_minimum', 'sell_rate_increment',
        'buy_rate', 'buy_rate_minimum', 'buy_rate_increment'];
        const csv = this.papa.unparse({ data: json, fields: fields}, config);
        return csv;
    }

    saveToFileSystem(csv, filenameinput) {
        const filename = filenameinput;
        const blob = new Blob([csv], { type: 'text/plain' });
        saveAs(blob, filename);
    }
}
