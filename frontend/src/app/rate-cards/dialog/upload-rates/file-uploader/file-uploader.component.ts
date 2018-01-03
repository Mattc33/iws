import { Component, OnInit} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

// Uploads to this URL
const URL = 'http://localhost:3000/public/uploads';

@Component({
    selector: 'app-fileuploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
})

export class FileUploaderComponent implements OnInit {

    // https://github.com/valor-software/ng2-file-upload
    public uploader = new FileUploader({
        url: URL,
        itemAlias: 'csv',
        allowedMimeType: ['text/csv'],
    });

    ngOnInit() {
       this.uploader.onAfterAddingFile = (file) => {
           file.withCredentials = false;
        };

        // On error
        this.uploader.onWhenAddingFileFailed = (fileItem) => {
            alert(`Upload Failed, please add a .csv file only you uploaded a ${fileItem.type}`);
            console.log('fail', fileItem);
        };

        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log('CSVUpload:uploaded:', item, status, response);
        };
    }
}
