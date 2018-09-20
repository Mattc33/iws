import { saveAs } from 'file-saver/FileSaver'
import { PapaParseService } from 'ngx-papaparse'

export default class FilesUtils {

    static saveAsFile = (csv: any, fileName: string = 'results.csv') => {
        const blob = new Blob([csv], { type: 'text/plain' });
        saveAs(blob, fileName);
    }

    static jsonToCsv = (json: any, config?: object, fields?: Array<string>) => {
        const _papa = new PapaParseService
        const csv = _papa.unparse({ data: json, field: fields }, config)
        return csv
    }

}