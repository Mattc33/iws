import { Component, Inject, OnInit, AnimationKeyframe, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RateCardsTableComponent } from './../../rate-cards-table.component';

import { RateCardsService } from '../../../services/rate-cards.api.service';
import { RateCardsSharedService } from '../../../services/rate-cards.shared.service';

@Component({
    selector: 'app-del-rate-cards-dialog',
    templateUrl: './delete-rate-cards-dialog.component.html',
    styleUrls: ['./delete-rate-cards-dialog.component.scss'],
    providers: [ RateCardsService ],
  })
  export class DeleteRateCardsDialogComponent implements OnInit {

    event_onDel = new EventEmitter;

    addCarrierFormGroup: FormGroup;
    rowObj;

    constructor(
      public dialogRef: MatDialogRef <RateCardsTableComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private rateCardsService: RateCardsService,
      private rateCardsSharedService: RateCardsSharedService
    ) {}

    ngOnInit() {
        this.rateCardsSharedService.currentRowObj.subscribe(receivedRowObj => this.rowObj = receivedRowObj);
    }

    click_delRateCard() {
        console.log(this.rowObj);
        this.aggrid_delRateCard();
        this.del_delCarrier();
        this.closeDialog();
    }

    aggrid_delRateCard() {
        this.event_onDel.emit('delete-ratecards');
    }

    del_delCarrier() {
        let rowId: number;
        for( let i = 0; i < this.rowObj.length; i++) {
            rowId = this.rowObj[i].id;
            this.rateCardsService.del_DeleteRateCard(rowId)
                .subscribe(resp => console.log(resp));
        }
    }

    // On method call close dialog
    closeDialog(): void {
        this.dialogRef.close();
    }

  }
