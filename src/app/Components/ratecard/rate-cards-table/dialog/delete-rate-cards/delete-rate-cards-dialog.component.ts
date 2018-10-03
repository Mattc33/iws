import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { RateCardsTableComponent } from '../../rate-cards-table.component';

import { RateCardsService } from '../../../../../shared/api-services/ratecard/rate-cards.api.service';
import { RateCardsSharedService } from '../../../../../shared/common-services/ratecard/rate-cards.shared.service';
import { SnackbarSharedService } from '../../../../../shared/common-services/global/snackbar.shared.service';

@Component({
    selector: 'app-del-rate-cards-dialog',
    template:  `<h2 mat-dialog-title>Are you sure?</h2>
                    <div mat-dialog-actions>
                    <button tabindex="-1" mat-button (click)="deleteRatecardHandler()" >Yes</button>
                    <button tabindex="-1" mat-button (click)="closeDialog()">No</button>
                </div>`,
    styleUrls: ['./delete-rate-cards-dialog.component.scss']
  })
  export class DeleteRateCardsDialogComponent implements OnInit {

    addCarrierFormGroup: FormGroup;
    rowsToDelete;

    constructor(
        public dialogRef: MatDialogRef <RateCardsTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private rateCardsService: RateCardsService,
        private rateCardsSharedService: RateCardsSharedService,
        private _snackbar: SnackbarSharedService
    ) {}

    ngOnInit() {
        this.rateCardsSharedService.currentRowAllObj
            .subscribe(data => this.rowsToDelete = data);
    }

    // ! Async Await Pattern
    // service(row) {
    //     this.rateCardsService.del_deleteRatecard(row.id)
    //         .subscribe(
    //             resp => {
    //                 if ( resp.status === 200 ) {
    //                     this._snackbar.snackbar_success('Ratecard Disabled', 2000);
    //                 }
    //             },
    //             error => {
    //                 this._snackbar.snackbar_error('Ratecard Failed to Disable', 2000);
    //             }
    //         );
    // }

    // del_disableRatecard() {
    //     for (const row of this.rowsToDelete) {
    //         this.service(row);
    //     }
    //     console.log('Final done');
    // }

    disableRatecards() { // ! Needs Async Code(with Observables) Here for Delete
        this.rowsToDelete.forEach(row => {
            this.rateCardsService.del_deleteRatecard(row.id)
            .subscribe(
                resp => {
                    if ( resp.status === 200 ) {
                        this._snackbar.snackbar_success('Ratecard Disabled', 2000);
                    }
                },
                error => {
                    this._snackbar.snackbar_error('Ratecard Failed to Disable', 2000);
                }
            );
        });
    }

    deleteRatecardHandler() {
        this.disableRatecards();
        this.closeDialog();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

  }


/*
    let observables: Observable[] = [];
    for (let i = 0; i < this.waypointIds.length; i++) {
        observables.push(this.categoryApi.getCategoryData(this.waypointIds[i]))
    }
    Observable.forkJoin(observables)
        .subscribe(dataArray => {
            // All observables in `observables` array have resolved and `dataArray` is an array of result of each observable
        });
*/
