import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RateCardsTableComponent } from './../../rate-cards-table.component';

import { RateCardsService } from './../../../../shared/api-services/ratecard/rate-cards.api.service';
import { RateCardsSharedService } from './../../../../shared/services/ratecard/rate-cards.shared.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
    selector: 'app-del-rate-cards-dialog',
    templateUrl: './delete-rate-cards-dialog.component.html',
    styleUrls: ['./delete-rate-cards-dialog.component.scss']
  })
  export class DeleteRateCardsDialogComponent implements OnInit {

    addCarrierFormGroup: FormGroup;
    rowObj;

    constructor(
      public dialogRef: MatDialogRef <RateCardsTableComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private rateCardsService: RateCardsService,
      private rateCardsSharedService: RateCardsSharedService,
      private _snackbar: SnackbarSharedService
    ) {}

    ngOnInit() {
        this.rateCardsSharedService.currentRowAllObj.subscribe(data => this.rowObj = data);
    }

    del_disableRatecard() {
        for (let i = 0; i < this.rowObj.length; i++) {
            this.rateCardsService.del_deleteRatecard(this.rowObj[i].id)
                .subscribe(
                    (resp) => {
                        console.log(resp);
                        if ( resp.status === 200 ) {
                            this._snackbar.snackbar_success('Ratecard Disabled', 2000);
                        }
                    },
                    error => {
                        console.log(error);
                        this._snackbar.snackbar_error('Ratecard Failed to Disable', 2000);
                    }
                );
        }
    }

    click_delRateCard() {
        this.del_disableRatecard();
        this.closeDialog();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

  }
