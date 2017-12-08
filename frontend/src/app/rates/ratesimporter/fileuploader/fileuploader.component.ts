import { Component, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-fileuploader',
  templateUrl: './fileuploader.component.html',
  styleUrls: ['./fileuploader.component.scss']
})
export class FileuploaderComponent {

  constructor(public http: Http) {}

  fileChange(event): void {
      const fileList: FileList = event.target.files;
      if (fileList.length > 0) {
          const file = fileList[0];

          const formData = new FormData();
          formData.append('file', file, file.name);

          const headers = new Headers();

          headers.append('Authorization', 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9....');
          const options = new RequestOptions({headers: headers});

          this.http.post('https://api.mysite.com/uploadfile', formData, options)
               .map(res => res.json())
               .catch(error => Observable.throw(error))
               .subscribe(
                   data => console.log('success'),
                   error => console.log(error)
               );
      }
  }
}
