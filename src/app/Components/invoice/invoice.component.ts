import { Component } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { saveAs } from 'file-saver/FileSaver';
import { InvoiceService } from './../../shared/api-services/invoice/invoice.api.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

    prefixLookupArr;
    groupedData;
    endResultCsv;

    sumTotalCalls;
    sumTotalSeconds;
    sumTotalMinutes;
    sumTotalCost;

    constructor(
        private _papa: PapaParseService,
        private _invoiceService: InvoiceService
    ) {
        this.get_prefixLookup();
    }

    // ================================================================================
    // * Invoice API Service
    // ================================================================================
    get_prefixLookup(): void {
        this._invoiceService.get_prefixLookup()
            .subscribe( data => {this.prefixLookupArr = data; console.log(data); } );
    }

    uploadBtnHandler(e): void {
        this.csvToJson(e.target.files[0]);
    }

    csvToJson(csvfile): void {
        const papaOptions = {
            complete: (results, file) => {
                const data = results.data;
                console.log('Parsed: ', data, file);
                this.processJson(data);
            }
        };
        this._papa.parse(csvfile, papaOptions);
    }

    jsonToCsv(json): void {
        const fields = ['prefix', 'destination',  'total_calls', 'total_seconds', 'total_minutes', 'unit_cost', 'total_cost'];
        const csv = this._papa.unparse({data: json, fields: fields});
        this.endResultCsv = csv
        + '\n\n'
        + ', , total_calls, total_seconds, total_minutes, , total_cost'
        + '\n'
        + `, , ${this.sumTotalCalls}, ${this.sumTotalSeconds}, ${this.sumTotalMinutes}, ,${this.sumTotalCost}`;
        console.log(this.endResultCsv);
    }

    processJson(data): void {
        const csvData = data;
        const remappedData = csvData.map( obj => {
            const totalCost = parseFloat(obj[13]).toFixed(4);
            return {
                prefix: obj[4],
                totalSeconds: obj[7],
                unitCost: obj[6],
                totalCost: totalCost
            };
        });

        const groupedData = this.groupBy(remappedData, 'prefix');

        const temp = [];
        for (const key in groupedData) {
            if (groupedData.hasOwnProperty(key)) {
                const element = groupedData[key];
                const sumSessionTime = this.sum(element, 'totalSeconds');
                const sumTotalCost = this.sum(element, 'totalCost');
                temp.push(
                    {
                        prefix: key,
                        destination: '',
                        total_calls: element.length,
                        total_seconds: sumSessionTime,
                        total_minutes: (sumSessionTime / 60),
                        unit_cost: element[0].unitCost,
                        total_cost: parseFloat(sumTotalCost.toFixed(4))
                    }
                );
            }
        }
        const json = temp.slice(0 , -1);
        this.updateWithDestination(json, this.prefixLookupArr);

        this.sumTotalCalls = this.sumCol(json, 'total_calls');
        this.sumTotalSeconds = this.sumCol(json, 'total_seconds');
        this.sumTotalCost = this.sumCol(json, 'total_cost').toFixed(4);
        this.sumTotalMinutes = this.sumCol(json, 'total_minutes');

        this.jsonToCsv(json);
    }

    updateWithDestination(arr, comparatorArr): Array<any> {
        const lookup = comparatorArr.reduce( (acc, cur) => {
            acc[cur.Prefix] = cur.Destination;
            return acc;
        }, {});

        return arr.map(item => {
            const match = lookup[item.prefix];
            if (!match) {
                item.destination = 'not found update lookup table';
            } else {
                item.destination = match;
            }
            return item;
        });
    }

    groupBy(arr, value): Array<any> {
        return arr.reduce( (acc, cur) => {
            const key = cur[value];
            acc[key] = acc[key] || [];
            acc[key].push( cur );
            return acc;
        }, {});
    }

    sumCol(arr, value): Number {
        return arr.reduce( (acc, cur) => {
            const result = acc + cur[value];
            return result;
        }, 0);
    }

    sum(arr, value): Number {
        return arr.reduce( (acc, cur) => {
            const eachItem = parseFloat(cur[value]);
            return acc + eachItem;
        }, 0);
    }

    saveToFileSystem(): void {
        const filename = 'results.csv';
        const blob = new Blob([this.endResultCsv], { type: 'text/plain' });
        saveAs(blob, filename);
    }

}


