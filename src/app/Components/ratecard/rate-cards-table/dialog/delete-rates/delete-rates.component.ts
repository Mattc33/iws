import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { RateCardsTableComponent } from '../../rate-cards-table.component';

import { RateCardsService } from '../../../../../shared/api-services/ratecard/rate-cards.api.service';
import { RateCardsSharedService } from '../../../../../shared/common-services/ratecard/rate-cards.shared.service';


@Component({
  selector: 'app-delete-rates',
  templateUrl: './delete-rates.component.html',
  styleUrls: ['./delete-rates.component.scss']
})
export class DeleteRatesComponent implements OnInit {

    event_onDel = new EventEmitter;
    private rowRatesObj;

    constructor(
        public dialogRef: MatDialogRef <RateCardsTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private rateCardsService: RateCardsService,
        private rateCardsSharedService: RateCardsSharedService,
    ) { }

    ngOnInit() {
        this.rateCardsSharedService.currentRowRatesObj
            .subscribe(data => this.rowRatesObj = data);
    }

    click_deleteRates() {
        // this.del_delRates();
        this.aggrid_deleteRates();

        this.closeDialog();
    }

    // del_delRates() {
    //     let rowRatesId: number;
    //     for( let i = 0; i<this.rowRatesObj.length; i++ ) {
    //         rowRatesId = this.rowRatesObj[i].id;
    //         this.ratesService.del_Rates(rowRatesId)
    //             .subscribe(resp => console.log(resp))
    //     }
    // };

    aggrid_deleteRates() {
        this.event_onDel.emit('delete-rates');
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

}
