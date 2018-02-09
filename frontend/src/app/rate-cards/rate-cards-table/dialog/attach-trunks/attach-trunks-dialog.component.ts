import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RateCardsTableComponent } from './../../rate-cards-table.component';

import { RateCardsService } from '../../../services/rate-cards.api.service';
import { CarrierService } from './../../../../carrier/services/carrier.api.service';
import { TrunksService } from './../../../../trunks/services/trunks.api.service';


@Component({
    selector: 'app-attach-trunks-dialog',
    templateUrl: './attach-trunks-dialog.component.html',
    styleUrls: ['./attach-trunks-dialog.component.scss'],
    providers: [ RateCardsService ],
  })
export class AttachTrunksDialogComponent implements OnInit {

    event_onAdd = new EventEmitter;
    
    // Form Group var
    private ratecardFormGroup: FormGroup;
    private trunksFormGroup: FormGroup;

    //
    private ratecards = [];
    private trunks = [];

    constructor(
        public dialogRef: MatDialogRef <RateCardsTableComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder, 
        private rateCardsService: RateCardsService, 
        private carrierService: CarrierService,
        private trunksService: TrunksService
    ) {};

    ngOnInit() {
        this.get_getRateCards();

        this.ratecardFormGroup = this.formBuilder.group({
            ratecardCtrl: ['', Validators.required]
        });
        this.trunksFormGroup = this.formBuilder.group({
            trunksCtrl: ['', Validators.required]
        });
    };

    /*
        ~~~~~~~~~~ API Service ~~~~~~~~~~
    */
    get_getRateCards(): void {
        this.rateCardsService.get_RateCard().subscribe(
            data => {
                this.ratecards = data;
            },
            error => { console.log(error); },
        )
    };

    get_getTrunks(): void {
        this.trunksService.get_allTrunks().subscribe(
            data => {
                this.trunks = data;
            },
            error => { console.log(error); },
        );
    };

    /*
        ~~~~~~~~~~ Extract Necessary Data Methods ~~~~~~~~~~
    */

    /*
        ~~~~~~~~~~ Get Input Values ~~~~~~~~~~
    */
    input_getRateCardId(): number {
        return this.ratecardFormGroup.get('ratecardCtrl').value;
    }

    

    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~ 
    */


    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */

    click_addRateCard(): void {
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

}

