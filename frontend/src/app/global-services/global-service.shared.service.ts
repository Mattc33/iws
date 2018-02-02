import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GlobalSharedService {

  // Passing server url to all services
  serverUrlSource = new BehaviorSubject<string>('https://172.20.13.129:8943/');
  currentServerUrl = this.serverUrlSource.asObservable();

}
