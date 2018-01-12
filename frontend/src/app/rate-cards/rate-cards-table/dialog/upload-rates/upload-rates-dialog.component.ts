import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { PapaParseService } from 'ngx-papaparse';

import { RateCardsTableComponent } from './../../rate-cards-table.component';

import { RateCardsService } from '../../../services/rate-cards.api.service';
import { RateCardsSharedService } from '../../../services/rate-cards.shared.service';
import { RatesService } from '../../../../rates/services/rates.api.service';

@Component({
  selector: 'app-upload-rates',
  templateUrl: './upload-rates-dialog.component.html',
  styleUrls: ['./upload-rates-dialog.component.scss']
})
export class UploadRatesDialogComponent implements OnInit {

    // Form Group var
    firstFormGroup: FormGroup; secondFormGroup: FormGroup; thirdFormGroup: FormGroup;

    // Var
    rateCardNames = []; // rate cards obj populated by API
    currentRateCardNames = []; // rate cards obj populated by method  currentRateCardList()
    carrierNames = []; // carrier obj populated by API

    // Insert Rates Props
    rateCardID: number;
    rateObj = [];
    fileName: string;
    disableUploadBoolean = true;

    constructor(public dialogRef: MatDialogRef <RateCardsTableComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private papa: PapaParseService,
    private formBuilder: FormBuilder, private rateCardsService: RateCardsService, private ratesService: RatesService) {}

    ngOnInit() {
        this.firstFormGroup = this.formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this.formBuilder.group({
            secondCtrl: ['', Validators.required],
        });
        this.thirdFormGroup = this.formBuilder.group({
            thirdCtrl: [''],
        });

        this.get_carrier();
        this.get_rateCard();
    }

    get_rateCard(): void {
        // subscribe to service and get carrier names
        this.rateCardsService.get_RateCard()
        .subscribe(
            data => {
                console.log(data);
                this.rateCardNames = data; //*
            },
            error => { console.log(error); },
        );
    }

    get_carrier(): void {
        this.rateCardsService.get_CarrierNames()
        .subscribe(
            data => {
                console.log(data);
                this.carrierNames = data;
            },
            error => { console.log(error); }
        );
    }

    // Get list of rate cards based on carrier selection on step 1 next click
    currentRateCardList(): void {
        const currentCarrier = this.input_getCarrierName();
        const currentRateCardNames = [];

        for ( let i = 0; i < this.rateCardNames.length; i++) {
            if ( this.rateCardNames[i].carrier_name === currentCarrier ) {
                currentRateCardNames.push( {name: this.rateCardNames[i].name}, );
            }
        }
        this.currentRateCardNames = currentRateCardNames;
    }

    input_getRateCardName(): string {
        const rateCardName = this.secondFormGroup.get('secondCtrl').value;
        return rateCardName;
    }

    input_getCarrierName(): string {
        const carrierName = this.firstFormGroup.get('firstCtrl').value;
        return carrierName;
    }

    getRateCardId() {
        const rateCardNameFromInput = this.input_getRateCardName();
        const rateCardNameFromArr = this.rateCardNames;
        let rateCardId: number;

        for (let i = 0; i < rateCardNameFromArr.length; i++) {
            if ( rateCardNameFromInput === rateCardNameFromArr[i].name) {
                rateCardId = rateCardNameFromArr[i].id;
            }
        }
        return rateCardId;
    }

    // Parse csv string into JSON
    papaParse(csvFile): void {
        this.papa.parse(csvFile, {
            fastMode: true,
            complete: (results) => {
                console.log('Parsed: ', results);
                const data = results.data;
                this.profileSorter(data);
                console.log(this.rateObj);
            }
        });
    }

    profileSorter(data) {
        if (this.input_getCarrierName() === 'PowerNet Global') {
            this.powerNetGlobalProfile(data);
        }
        if (this.input_getCarrierName() === 'VoxBeam') {
            this.voxBeamProfile(data);
        } else {
            return;
        }
    }

    // Profiles for each carrier
    powerNetGlobalProfile(data) {
        const dataSliced = data.slice(3);

        for (let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][0];
            const prefix: string = dataSliced[i][1];
            const buyrate: number = dataSliced[i][2].slice(1) * 1;
            const sellrate: number = buyrate * 1.05;
            this.rateObj.push( { destination: destination, prefix: prefix, buy_rate: buyrate, sell_rate: sellrate  }, );
        }
    }

    voxBeamProfile(data) {
        const dataSliced = data.slice(1);

        for (let i = 0; i < dataSliced.length; i++) {
          const destination: string = dataSliced[i][2];
          const prefix: string = dataSliced[i][0];
          const buyrate: number = dataSliced[i][3] * 1;
          const sellrate: number = buyrate * 1.05;
          this.rateObj.push( { destination: destination, prefix: prefix, buy_rate: buyrate, sell_rate: sellrate  }, );
        }
    }

    // listens on input="text" change event, if file uploaded pass to csv parser and flag the button to turn on,
    // else flag the button to remain off
    changeListenerUploadBtn(event): void {
        if (event.target.files && event.target.files[0]) {
            const csvFile = event.target.files[0];
            this.fileName = csvFile.name;
            this.papaParse(csvFile);
            // pass boolean flag for valdation
            this.disableUploadBoolean = false;
        } else {
            this.disableUploadBoolean = true;
        }
    }

    // pass into step 2's [disable] to control button disable
    uploadValidator(): boolean {
        if (this.disableUploadBoolean === true) {
            return true;
        }
        if ( this.disableUploadBoolean === false ) {
            return false;
        }
    }

    click_addRates(): void {
        this.post_addRates();
        this.closeDialog();
    }

    post_addRates(): void {
        const id: number = this.getRateCardId();
        const body = this.rateObj;
        console.log('rate card id --> ' + id);

        this.ratesService.post_Rates(body, id)
            .subscribe(res => console.log(res));
    }

    // close dialog
    closeDialog(): void {
        this.dialogRef.close();
    }

}
