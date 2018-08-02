import { Component, OnInit } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

    groupedData;
    endResultCsv;

    sumTotalCalls;
    sumTotalSeconds;
    sumTotalMinutes;
    sumTotalCost;

    constructor(
        private _papa: PapaParseService
    ) { }

    ngOnInit() {

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
        const fields = ['destination',  'total_calls', 'total_seconds', 'total_minutes', 'unit_cost', 'total_cost'];
        const csv = this._papa.unparse({data: json, fields: fields});
        this.endResultCsv = csv
        + '\n\n'
        + ', total_calls, total_seconds, total_minutes, , total_cost'
        + '\n'
        + `, ${this.sumTotalCalls}, ${this.sumTotalSeconds}, ${this.sumTotalMinutes}, ,${this.sumTotalCost}`;
    }

    processJson(data): void {
        const csvData = data;
        const remappedData = csvData.map( obj => {
            return {
                destination: obj[4],
                totalSeconds: obj[7],
                unitCost: obj[6]
            };
        });

        const groupedData = this.groupBy(remappedData, 'destination');

        const temp = [];
        for (const key in groupedData) {
            if (groupedData.hasOwnProperty(key)) {
                const element = groupedData[key];
                const sumSessionTime = this.sum(element, 'totalSeconds');
                const sumSessionBill = this.sum(element, 'unitCost');
                temp.push(
                    {
                        destination: key,
                        total_calls: element.length,
                        total_seconds: sumSessionTime,
                        total_minutes: sumSessionTime / 60,
                        unit_cost: element[0].unitCost,
                        total_cost: (sumSessionTime / 60) * element[0].unitCost
                    }
                );
            }
        }
        const json = temp.slice(0 , -1);
        console.log(json);

        this.sumTotalCalls = this.sumCol(json, 'total_calls');
        this.sumTotalSeconds = this.sumCol(json, 'total_seconds');
        this.sumTotalCost = this.sumCol(json, 'total_cost');
        this.sumTotalMinutes = this.sumCol(json, 'total_minutes');

        this.jsonToCsv(json);

    }

    groupBy(arr, value) {
        return arr.reduce( (acc, cur) => {
            const key = cur[value];
            acc[key] = acc[key] || [];
            acc[key].push( cur );
            return acc;
        }, {});
    }

    sumCol(arr, value) {
        return arr.reduce( (acc, cur) => {
            const result = acc + cur[value];
            return result;
        }, 0);
    }

    sum(arr, value) {
        return arr.reduce( (acc, cur) => {
            const eachItem = parseFloat(cur[value]);
            return acc + eachItem;
        }, 0);
    }

    saveToFileSystem() {
        const filename = 'results.csv';
        const blob = new Blob([this.endResultCsv], { type: 'text/plain' });
        saveAs(blob, filename);
    }

}


