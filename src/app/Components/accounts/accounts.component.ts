import { Component, OnInit } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
    
    groupedData;
    endResultCsv;

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
        const fields = ['destination',  'total_calls', 'total_seconds', 'unit_cost', 'total_cost'];
        const csv = this._papa.unparse({data: json, fields: fields});
        this.endResultCsv = csv;
        console.log(this.endResultCsv);
    }

    processJson(data): void {
        const csvData = data;
        const remappedData = csvData.map( obj => {
            return {
                destination: obj[4],
                totalSeconds: obj[7],
                totalCost: obj[13],
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
                        unit_cost: element[0].unitCost,
                        total_cost: sumSessionBill
                    }
                );
            }
        }
        const json = temp.slice(0 , -1);
        console.log(json);

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


