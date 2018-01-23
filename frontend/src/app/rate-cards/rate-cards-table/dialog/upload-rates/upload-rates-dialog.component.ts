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
    firstFormGroup: FormGroup; secondFormGroup: FormGroup; thirdFormGroup: FormGroup; fourthFormGroup: FormGroup;

    // Var
    rateCardNames = []; // rate cards obj populated by API
    currentRateCardNames = []; // rate cards obj populated by method  currentRateCardList()
    carrierNames = []; // carrier obj populated by API
    percents = [
        {value: 1.05, viewValue: '5%'}, {value: 1.1, viewValue: '10%'}, {value: 1.15, viewValue: '15%'}, {value: 1.2, viewValue: '20%'}, 
        {value: 1.25, viewValue: '25%'}, {value: 1.3, viewValue: '30%'}, {value: 1.35, viewValue: '35%'}, {value: 1.4, viewValue: '40%'}, 
        {value: 1.45, viewValue: '45%'}, {value: 1.5, viewValue: '50%'}, {value: 1.55, viewValue: '55%'}, {value: 1.6, viewValue: '60%'}, 
        {value: 1.65, viewValue: '65%'}, {value: 1.7, viewValue: '70%'}, {value: 1.75, viewValue: '75%'}, {value: 1.8, viewValue: '80%'}, 
        {value: 1.85, viewValue: '85%'}, {value: 1.9, viewValue: '90%'}, {value: 1.95, viewValue: '95%'}, {value: 2, viewValue: '100%'}
    ];

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
            thirdCtrl: ['', Validators.required],
        });
        this.fourthFormGroup = this.formBuilder.group({
            fourthCtrl: [''],
        });

        this.get_carrier();
        this.get_rateCard();
    }

    get_rateCard(): void {  // subscribe to service and get carrier names
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

    currentRateCardList(): void { // Get list of rate cards based on carrier selection on step 1 next click
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

    getRateCardId(): number {
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

    getSellRatePercent(): number {
        const sellRatePercent = this.thirdFormGroup.get('thirdCtrl').value;
        return sellRatePercent;
    }

    papaParse(csvFile): void { // Parse csv string into JSON
        this.papa.parse(csvFile, {
            // papa parse options
            fastMode: true,
            complete: (results) => {
                console.log('Parsed: ', results);
                const data = results.data;
                this.profileSorter(data);
                console.log(this.rateObj);
            }
        });
    }

    profileSorter(data) { // Based on the Carrier Name match the String to trigger the right profile
        const percent = this.getSellRatePercent();
        const currentCarrierName = this.input_getCarrierName();
        if (currentCarrierName === 'PowerNet Global') {
            console.log('using Power Net Global Profile');
            this.powerNetGlobalProfile(data, percent);
        }
        if (currentCarrierName === 'VoxBeam') {
            console.log('using VoxBeam Profile');
            this.voxBeamProfile(data, percent);
        }
        if (currentCarrierName === 'Alcazar Networks Inc') {
            console.log('using Alcazar Networks Inc Profile');
            this.alcazarNetworksProfile(data, percent);
        }
        if (currentCarrierName === 'Bankai Group') {
            console.log('using Bankai Group Profile');
            if ( this.input_getRateCardName() === 'Bankai Silver' || this.input_getRateCardName() === 'Bankai Gold') {
                console.log('gold or silver profile');
                this.bankaiGroupSilverGoldProfile(data, percent);
            }
            if ( this.input_getRateCardName() === 'Bankai Platinum' ) {
                console.log('platinum profile');
                this.bankaiGroupPlatinumProfile(data, percent);
            }
        }
        if (currentCarrierName === 'PCCW Global' ) {
            console.log('using PCCW Global Profile');
            this.pccwGlobalProfile(data, percent);
        }
        if (currentCarrierName === 'StarSSip LLC') {
            console.log('using Starsipp Profile')
            this.starsippProfile(data, percent);
        }
        if (currentCarrierName === 'Teleinx') {
            console.log('using Teleinx Profile');
            this.teleinxProfile(data, percent);
        }
        if (currentCarrierName === 'VoiPlatinum Portal') {
            console.log('using VoiPlatinum Profile');
            this.voiPlatinumProfile(data, percent);
        }
        if (currentCarrierName === 'VOIP Routes') {
            console.log('using VOIP Routes Profile');
            this.voipRoutesProfile(data, percent);
        }
        else {
            return;
        }
    }

    powerNetGlobalProfile(data, percent) {
        const dataSliced = data.slice(4);

        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][2].slice(1) * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
            { destination: destination, 
                prefix: prefix, 
                buy_rate: buyrate, 
                buy_rate_minimum: 0, 
                buy_rate_increment: 0,
                sell_rate: sellrate,
                sell_rate_minimum: 0,
                sell_rate_increment: 0
            }, 
            );
        }
    }

    voxBeamProfile(data, percent) {
        const dataSliced = data.slice(1);

        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][2];
            let prefix: string = dataSliced[i][0];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][3] * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
                { destination: destination, 
                    prefix: prefix, 
                    buy_rate: buyrate, 
                    buy_rate_minimum: buyrate, 
                    buy_rate_increment: 0,
                    sell_rate: sellrate, 
                    sell_rate_minimum: 0,
                    sell_rate_increment: 0
                }, 
            );
        }
    }

    alcazarNetworksProfile(data, percent) {
        const dataSliced = data.slice(7);
    
        for(let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][2] * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
                { destination: destination, 
                    prefix: prefix, 
                    buy_rate: buyrate, 
                    buy_rate_minimum: buyrate, 
                    buy_rate_increment: 0,
                    sell_rate: sellrate,  
                    sell_rate_minimum: 0,
                    sell_rate_increment: 0
                }, 
            );
        }
    }

    bankaiGroupSilverGoldProfile(data, percent) {
        const dataSliced = data.slice(1);
    
        for(let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][3] * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
                { destination: destination, 
                    prefix: prefix, 
                    buy_rate: buyrate, 
                    buy_rate_minimum: buyrate, 
                    buy_rate_increment: 0,
                    sell_rate: sellrate,  
                    sell_rate_minimum: 0,
                    sell_rate_increment: 0
                }, 
            );
        }
    }

    bankaiGroupPlatinumProfile(data, percent) {
        const dataSliced = data.slice(1);
    
        for(let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][2] * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
                { destination: destination, 
                    prefix: prefix, 
                    buy_rate: buyrate, 
                    buy_rate_minimum: buyrate, 
                    buy_rate_increment: 0,
                    sell_rate: sellrate,  
                    sell_rate_minimum: 0,
                    sell_rate_increment: 0
                }, 
            );
        }
    }

    pccwGlobalProfile(data, percent) {
        const dataSliced = data.slice(13);
    
        for(let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][4] * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
                { destination: destination, 
                    prefix: prefix, 
                    buy_rate: buyrate, 
                    buy_rate_minimum: buyrate, 
                    buy_rate_increment: 0,
                    sell_rate: sellrate,  
                    sell_rate_minimum: 0,
                    sell_rate_increment: 0
                }, 
            );
        }
    }

    starsippProfile(data, percent) {
        const dataSliced = data.slice(1);
    
        for(let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][1];
            let prefix: string = dataSliced[i][2];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][3] * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
                { destination: destination, 
                    prefix: prefix, 
                    buy_rate: buyrate, 
                    buy_rate_minimum: buyrate, 
                    buy_rate_increment: 0,
                    sell_rate: sellrate,  
                    sell_rate_minimum: 0,
                    sell_rate_increment: 0
                }, 
            );
        }
    }

    teleinxProfile(data, percent) {
        const dataSliced = data.slice(1);
    
        for(let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][1];
            let prefix: string = dataSliced[i][2];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][3] * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
                { destination: destination, 
                    prefix: prefix, 
                    buy_rate: buyrate, 
                    buy_rate_minimum: buyrate, 
                    buy_rate_increment: 0,
                    sell_rate: sellrate,  
                    sell_rate_minimum: 0,
                    sell_rate_increment: 0
                }, 
            );
        } 
    }

    voiPlatinumProfile(data, percent) {
        const dataSliced = data.slice(1, -1);
    
        for(let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }
                if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][2] * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
                { destination: destination, 
                    prefix: prefix, 
                    buy_rate: buyrate, 
                    buy_rate_minimum: buyrate, 
                    buy_rate_increment: 0,
                    sell_rate: sellrate,  
                    sell_rate_minimum: 0,
                    sell_rate_increment: 0
                }, 
            );
        } 
    }

    voipRoutesProfile(data, percent) {
        const dataSliced = data.slice(9);
    
        for(let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][1];
            let prefix: string = dataSliced[i][0];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }
                if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][2] * 1;
            const sellrate: number = buyrate * percent;
            this.rateObj.push( 
                { destination: destination, 
                    prefix: prefix, 
                    buy_rate: buyrate, 
                    buy_rate_minimum: buyrate, 
                    buy_rate_increment: 0,
                    sell_rate: sellrate,  
                    sell_rate_minimum: 0,
                    sell_rate_increment: 0
                }, 
            );
        } 
    }

    changeListenerUploadBtn(event): void { // listens on change event, if file uploaded passes csv-parser check, change flag for button
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

    uploadValidator(): boolean { // pass into step 2's [disable] to control button disable
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
