import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CarrierService } from './../services/carrier.service';
import { Carrier } from '../models/carrier.model';

@Component({
  selector: 'app-carrier-table',
  templateUrl: './carrier-table.component.html',
  styleUrls: ['./carrier-table.component.scss'],
  providers: [ CarrierService ],
  encapsulation : ViewEncapsulation.None,
})

export class CarrierTableComponent implements OnInit {

  carriers: Carrier[];

  constructor(private carrierService: CarrierService) {}

  ngOnInit() {
    this.onGetTable();
  }

  onGetTable() {
    this.carrierService.getCarriers()
      .subscribe(
        data => this.carriers = data,
      );
  }

  onPostRow(name, address, phone_number, taxable, tier_number, two_digit_unique_code): void {
    const body = {
      name: name,
      address: address,
      phone_number: phone_number,
      taxable: taxable,
      tier_number: tier_number,
      two_digit_unique_code: two_digit_unique_code,
    };

    this.carrierService.postAddRow(body)
      .subscribe(result => console.log(result));
  }

  onEditComplete(e) {
    console.log('on edit complete event fired');

  }

  onCellClick(ri) {
    console.log(ri);
  }

  // ri = row index
  onDeleteRow(ri): void {
    const getId = this.carriers[ri].id;
    this.carrierService.delDeleteRow(getId)
      .subscribe(
        result => console.log(result));
  }

}
