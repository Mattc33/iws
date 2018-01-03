import { Component, Inject, OnInit, AnimationKeyframe, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddRateCardDialogComponent } from './../dialog/add-rate-cards/add-rate-cards-dialog.component';
import { UploadRatesDialogComponent } from './../dialog/upload-rates/upload-rates-dialog.component';

@Component({
  selector: 'app-rates-ui',
  templateUrl: './rate-cards-ui.component.html',
  styleUrls: ['./rate-cards-ui.component.scss'],
})

export class RateCardsUiComponent implements OnInit {

    constructor( public dialog: MatDialog ) {}

    ngOnInit() {
    }

    openDialogAdd(): any {
        const dialogRef = this.dialog.open(AddRateCardDialogComponent, {
            width: 'auto',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    } // end openDialogAdd UploadRatesDialog

    openDialogUpload(): any {
        const dialogRef = this.dialog.open(UploadRatesDialogComponent, {
            width: 'auto',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    } // end openDialogAdd UploadRatesDialogComponent
}

