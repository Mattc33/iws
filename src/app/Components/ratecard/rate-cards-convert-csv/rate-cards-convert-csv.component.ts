import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';
import { PapaParseService } from 'ngx-papaparse';
import { saveAs } from 'file-saver/FileSaver';

import { NestedAgGridService } from '../../../shared/services/global/nestedAgGrid.shared.service';
import { RateCardsService } from '../../../shared/api-services/ratecard/rate-cards.api.service';

@Component({
  selector: 'app-rate-cards-convert-csv',
  templateUrl: './rate-cards-convert-csv.component.html',
  styleUrls: ['./rate-cards-convert-csv.component.scss']
})

export class RateCardsConvertCsvComponent implements OnInit {

    rowData;
    columnDefs;
    gridApi: GridApi;

    rowSelectionTypeM = 'multiple';
    getNodeChildDetails;
    currentSelectedRows;
    download: string;
    oneCsv;
    arrOfRates = [];
    disableStep2 = true;

    constructor(
        private rateCardsService: RateCardsService,
        private nestedAgGridService: NestedAgGridService,
        private papa: PapaParseService
    ) {
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_ratecards();
    }

    // ================================================================================
    // Ratecard API Service
    // ================================================================================
    get_ratecards(): void {
        this.rateCardsService.get_ratecard()
            .subscribe(
                data => {
                    this.rowData = this.nestedAgGridService.formatDataToNestedArr(data);
                },
                error => { console.log(error); },
                () => {
                    // console.log(this.rowData);
                }
            );
    }

    get_specificRatecardOneFile(ratecard_id: number, fileName: string): void {
        this.rateCardsService.get_ratesInRatecard(ratecard_id)
            .subscribe(
                data => {
                    this.arrOfRates.push(data);
                },
                error => {

                },
            );
    }

    // ================================================================================
    // AG Grid Initiation
    // ================================================================================
    onGridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'RateCard Group', field: 'ratecard_bundle',
                cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,
                width: 300, cellStyle: { 'border-right': '1px solid #E0E0E0' },
                unSortIcon: true, sort: 'asc',
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                unSortIcon: true,
            },
            {
                headerName: 'Date', field: 'dateAdded',
                unSortIcon: true,
            }
        ];
    }

    // ================================================================================
    // AG Grid events
    // ================================================================================
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    rowSelected() {
        this.currentSelectedRows = this.gridApi.getSelectedRows();
    }

    // ================================================================================
    // CSV conversion
    // ================================================================================
    onConvertJsonToCsv(): void {
        for ( let i = 0; i < this.currentSelectedRows.length; i++ ) {
            const eachRatecard = this.currentSelectedRows[i].id;
            const fileName = this.getSelectedFileNames(i);
            // this.get_specificRatecard(eachRatecard, fileName);
        }
        this.currentSelectedRows.array.forEach( (element, index) => {
            const eaRatecard = element.id;
            const fileName = this.getSelectedFileNames(index);

        });
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

    // ================================================================================
    // CSV conversion
    // ================================================================================
    onConvertJsonToCsvOneFile() {
        for ( let i = 0; i < this.currentSelectedRows.length; i++ ) {
            const eachRatecard = this.currentSelectedRows[i].id;
            const fileName = this.getSelectedFileNames(0);
            this.get_specificRatecardOneFile(eachRatecard, fileName);
        }
        this.flipButtonDisable();
    }

    flipButtonDisable() {
        this.disableStep2 = !this.disableStep2;
    }

    getSelectedFileNamesAZ(id): string {
        const ratecard_name = this.gridApi.getSelectedRows()[id].ratecard_bundle;
        const country = this.gridApi.getSelectedRows()[id].country;
        const carrier = this.gridApi.getSelectedRows()[id].carrier_name;
        const currentTime = Date.now();
        const fileName = `${ratecard_name}_AZ_${carrier}_${currentTime}`.replace(/\s/g, '');
        return fileName;
    }

    formOneFile() {
        const fileName = this.getSelectedFileNamesAZ(0);
        const merged = [].concat.apply([], this.arrOfRates);
        const mergedWithCents = [];

        for ( let i = 0; i < merged.length; i++) {
            mergedWithCents.push(
                {
                    prefix: merged[i].prefix,
                    destination: merged[i].destination,
                    sell_rate: merged[i].sell_rate * 100,
                    sell_rate_minimum: 1,
                    sell_rate_increment: 1,
                    buy_rate: merged[i].buy_rate * 100,
                    buy_rate_minimum: 1,
                    buy_rate_increment: 1
                }
            );
        }

        const csv = this.papaUnparse(mergedWithCents);
        this.saveToFileSystem(csv, fileName);

        this.arrOfRates = [];
        this.disableStep2 = !this.disableStep2;
    }
}
