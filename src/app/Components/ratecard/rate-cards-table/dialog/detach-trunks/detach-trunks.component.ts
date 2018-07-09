import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { RateCardsTableComponent } from '../../rate-cards-table.component';

import { RateCardsService } from '../../../../../shared/api-services/ratecard/rate-cards.api.service';
import { RateCardsSharedService } from '../../../../../shared/services/ratecard/rate-cards.shared.service';

@Component({
  selector: 'app-detach-trunks',
  templateUrl: './detach-trunks.component.html',
  styleUrls: ['./detach-trunks.component.scss']
})
export class DetachTrunksComponent implements OnInit {

    event_onDel = new EventEmitter;
    private rowRatesObj;
    private ratecardId;

    constructor(
        public dialogRef: MatDialogRef <RateCardsTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private rateCardsService: RateCardsService,
        private rateCardsSharedService: RateCardsSharedService
    ) { }

    ngOnInit() {
        this.rateCardsSharedService.currentRowTrunksObj.subscribe(data => this.rowRatesObj = data);
        this.rateCardsSharedService.currentRowAllObj.subscribe(data => this.ratecardId = data);
    }

    click_detachTrunks() {
        this.del_detachTrunks();
        this.aggrid_deleteTrunks();

        this.closeDialog();
    };

    del_detachTrunks() {
        let trunksId: number;
        for( let i = 0; i<this.rowRatesObj.length; i++ ) {
            trunksId = this.rowRatesObj[i].id;
            this.rateCardsService.del_DetachTrunk(this.ratecardId[0].id, trunksId)
                .subscribe(resp => console.log(resp))
        }
    };

    aggrid_deleteTrunks() {
        this.event_onDel.emit('delete-trunks');
    };

    closeDialog(): void {
        this.dialogRef.close();
    };

}
