import { Component }                from '@angular/core'
import { PapaParseService }         from 'ngx-papaparse'

import FilesUtils                   from '../../shared/utils/files/files.utils'
import { InvoiceService }           from './../../shared/api-services/invoice/invoice.api.service'

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

    prefixLookupTable: Array<{}> // build an interface for this table
    groupedData
    endResultCsv

    sumTotalCalls
    sumTotalSeconds
    sumTotalMinutes
    sumTotalCost

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
            .subscribe( data => this.prefixLookupTable = data );
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
    }

    processJson(data): void {
        const csvData = data;
        const remappedData = csvData.map( obj => {
            return {
                prefix: obj[4],
                totalSeconds: obj[7],
                unitCost: obj[6],
                totalCost: obj[13]
            };
        });

        const groupedData = this.groupBy(remappedData, 'prefix');

        const temp = [];
        for (const key in groupedData) {
            if (groupedData.hasOwnProperty(key)) {
                const element = groupedData[key];
                const sumSessionTime = this.sum(element, 'totalSeconds');
                const total_minute = sumSessionTime / 60;
                const unit_cost = parseFloat(element[0].unitCost).toFixed(4);
                const sumTotalCost = this.sum(element, 'totalCost');
                // const total_cost = parseFloat(parseFloat(sumTotalCost).toFixed(2));
                    // ! temp fix for a2billing csv with 60/60 billing interval
                    const total_cost = parseFloat((total_minute * element[0].unitCost).toFixed(2));
                temp.push(
                    {
                        prefix: key,
                        destination: '',
                        total_calls: element.length,
                        total_seconds: sumSessionTime,
                        total_minutes: total_minute,
                        unit_cost: unit_cost,
                        total_cost: total_cost
                    }
                );
            }
        }
        const json = temp.slice(0 , -1);
        this.updateWithDestination(json, this.prefixLookupTable);

        this.sumTotalCalls = this.sumCol(json, 'total_calls');
        this.sumTotalSeconds = this.sumCol(json, 'total_seconds');
        this.sumTotalCost = this.sumCol(json, 'total_cost');
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
            (!match) ? item.destination = 'not found update lookup table' : item.destination = match;
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

    sumCol(arr, value): number {
        return arr.reduce( (acc, cur) => {
            const result = acc + cur[value];
            return result;
        }, 0);
    }

    sum(arr, value): any {
        return arr.reduce( (acc, cur) => {
            const eachItem = parseFloat(cur[value]);
            return acc + eachItem;
        }, 0);
    }

    saveToFileSystem(): void {
        FilesUtils.saveAsFile(this.endResultCsv, 'results.csv')
    }

}


