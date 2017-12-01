import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';

import { CarrierService } from './../services/carrier.service';
import { Carrier } from '../models/carrier.model';
import { Header } from 'primeng/primeng';
import { Footer } from 'primeng/primeng';

@Component({
  selector: 'app-carrier-table',
  templateUrl: './carrier-table.component.html',
  styleUrls: ['./carrier-table.component.scss'],
  providers: [ CarrierService ],
})

export class CarrierTableComponent implements OnInit {

  carriers: Carrier[];

  constructor(private carrierService: CarrierService) {}

  ngOnInit() {
    this.carrierService.getCarriers()
    .subscribe(
      (data) => this.carriers = data
    );
  }


}
