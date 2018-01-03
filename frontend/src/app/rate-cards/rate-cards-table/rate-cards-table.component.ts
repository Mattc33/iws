import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateCardsService } from './../services/rate-cards.service';

import { GridOptions, GridApi } from 'ag-grid';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-rate-cards-table',
  templateUrl: './rate-cards-table.component.html',
  styleUrls: ['./rate-cards-table.component.scss']
})
export class RateCardsTableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
