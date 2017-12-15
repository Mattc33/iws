import { Component, Inject, OnInit } from '@angular/core';
import { CarrierService } from './services/carrier.service';
import { AddCarrierDialogComponent } from './dialog/carrier-ui.component';


@Component({
  selector: 'app-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.scss']
})

export class CarrierComponent implements OnInit {

  constructor(private carrierService: CarrierService) { }

  ngOnInit() {
  }

  // ri = row index
  onDeleteRow(): void {
  }

}
