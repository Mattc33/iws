import { Component, OnInit } from '@angular/core';
import { GetCarriersTableService } from './get-carriers-table.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public activities$: Observable<any>;

  constructor(private activityService: GetCarriersTableService) { }

  ngOnInit() {
      this.activities$ = this.activityService.getActivities();
  }
}
