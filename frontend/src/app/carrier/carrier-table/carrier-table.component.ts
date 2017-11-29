import { CarrierService } from './../Services/carrier.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-carrier-table',
  templateUrl: './carrier-table.component.html',
  styleUrls: ['./carrier-table.component.scss'],
  providers: [CarrierService]
})
export class CarrierTableComponent implements OnInit {
  carriers = [];

  constructor(private carrierService: CarrierService){}

  ngOnInit() {
    this.carrierService.getCarriers()
      .subscribe(
        // (data) => console.log(data)
        (data) => this.carriers = data
      );
  }
}
