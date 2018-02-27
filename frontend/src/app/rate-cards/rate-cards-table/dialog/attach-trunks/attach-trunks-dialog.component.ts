import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RateCardsTableComponent } from './../../rate-cards-table.component';

import { RateCardsService } from '../../../services/rate-cards.api.service';
import { RateCardsSharedService } from './../../../services/rate-cards.shared.service';
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
    private trunksFormGroup: FormGroup;

    // Shared service props
    private ratecardsObj;
    private trunksObj;

    // props
    private trunksFormObj = [];

    constructor(
        public dialogRef: MatDialogRef <RateCardsTableComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder, 
        private rateCardsService: RateCardsService, 
        private rateCardsSharedService: RateCardsSharedService,
        private trunksService: TrunksService,
    ) {};

    ngOnInit() {
        this.get_getTrunks();
        this.rateCardsSharedService.currentRowAllObj.subscribe(data => this.ratecardsObj = data );

        this.trunksFormGroup = this.formBuilder.group({
            trunksCtrl: [, Validators.required]
        });
    };

    /*
        ~~~~~~~~~~ API Service ~~~~~~~~~~
    */
    get_getTrunks(): void {
        this.trunksService.get_allTrunks().subscribe(
            data => {
                this.trunksObj = data;
                this.extract_trunksData(data);
            },
            error => { console.log(error); },
        );
    };

    post_attachTrunksToRatecard(ratecardId: number, trunkId: number): void {
        this.rateCardsService.post_AttachTrunk(ratecardId, trunkId)
            .subscribe(resp => console.log(resp));
    }

    /*
        ~~~~~~~~~~ Extract Necessary Data Methods ~~~~~~~~~~
    */
    extract_trunksData(data): void {
        for(let i = 0; i<data.length; i++) {
            this.trunksFormObj.push(
                {value: data[i].id, name: data[i].trunk_name},
            );
        };
    };

    extract_trunksId(): number {
        for(let i = 0; i<this.trunksFormObj.length; i++) {
            if(this.trunksFormGroup.get('trunksCtrl').value === this.trunksFormObj[i].name) {
                return this.trunksFormObj[i].value;
            } else {
            }
        }
    }; 

    extract_trunkObj() {
        const inputValue = this.trunksFormGroup.get('trunksCtrl').value;
        for(let i = 0; i<this.trunksObj.length; i++){
            if(inputValue === this.trunksObj[i].trunk_name) {
                return this.trunksObj[i];
            } else {
            }
        }
    }

    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~ 
    */
    aggrid_addTrunkData() {
        this.event_onAdd.emit(this.extract_trunkObj());
    }


    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    click_attachTrunks(): void {
        const trunkId = this.extract_trunksId();
        const ratecardId = this.ratecardsObj[0].id;

        this.post_attachTrunksToRatecard(ratecardId, trunkId);
        this.aggrid_addTrunkData();

        this.closeDialog();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

}

