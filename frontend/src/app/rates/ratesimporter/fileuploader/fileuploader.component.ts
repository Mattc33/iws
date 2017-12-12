import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:3000/public/uploads';

@Component({
    selector: 'app-fileuploader',
    templateUrl: './fileuploader.component.html',
    styleUrls: ['./fileuploader.component.scss']
})

export class FileUploaderComponent implements OnInit {

    public uploader = new FileUploader({
        url: URL,
        itemAlias: 'csv',
        allowedMimeType: ['text/csv'],
    });

    ngOnInit() {
       this.uploader.onAfterAddingFile = (file) => {
           file.withCredentials = false;
        };

        this.uploader.onWhenAddingFileFailed = (fileItem) => {
            alert(`Upload Failed, please add a .csv file only you uploaded a ${fileItem.type}`);
            console.log('fail', fileItem);
        };

        console.log('hello');

        // this.uploader.onBuildItemForm = function(fileItem, form) {
        //     form.append('myvar', 'myval');
        //     return { fileItem, form };
        // };

        // this.uploader.queue[0].upload();

       this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log('CSVUpload:uploaded:', item, status, response);
        };
    }
}
