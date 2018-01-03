import { Component, Inject, OnInit, AnimationKeyframe } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AddCarrierDialogComponent } from './../dialog/add-carrier/add-carrier-dialog.component';
import { DelCarrierDialogComponent } from './../dialog/del-carrier/del-carrier-dialog.component';


import { CarrierService } from '../services/carrier.service';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-carrier-ui',
  templateUrl: './carrier-ui.component.html',
  styleUrls: ['./carrier-ui.component.scss'],
})

export class CarrierUiComponent implements OnInit {

  rowID: number;

  constructor(private tableService: TableService, public dialog: MatDialog ) {}

  ngOnInit() {
    this.tableService.currentRowID.subscribe(receivedRowID => this.rowID = receivedRowID);
  }

  openDialogAdd(): any {
    const dialogRef = this.dialog.open(AddCarrierDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  } // end openDialogAdd

  openDialogDel(): any {
    const dialogRef = this.dialog.open(DelCarrierDialogComponent, {
      data: { rowID: this.rowID },
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }// end openDialogDel

}
