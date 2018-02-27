import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material';

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
    private carrierFormGroup: FormGroup; 
    private ratecardFormGroup: FormGroup; 
    private percentFormGroup: FormGroup; 
    private uploadRatesFormGroup: FormGroup;

    // DB Objects
    private carrierObj = [];
    private ratecardObj = [];

    private currentRateCardNames = []; // rate cards obj populated by method  currentRateCardList()

    // Input props
    private percents = [
        {value: 1.05, viewValue: '5%'}, {value: 1.1, viewValue: '10%'}, {value: 1.15, viewValue: '15%'}, {value: 1.2, viewValue: '20%'}, 
        {value: 1.25, viewValue: '25%'}, {value: 1.3, viewValue: '30%'}, {value: 1.35, viewValue: '35%'}, {value: 1.4, viewValue: '40%'}, 
        {value: 1.45, viewValue: '45%'}, {value: 1.5, viewValue: '50%'}, {value: 1.55, viewValue: '55%'}, {value: 1.6, viewValue: '60%'}, 
        {value: 1.65, viewValue: '65%'}, {value: 1.7, viewValue: '70%'}, {value: 1.75, viewValue: '75%'}, {value: 1.8, viewValue: '80%'}, 
        {value: 1.85, viewValue: '85%'}, {value: 1.9, viewValue: '90%'}, {value: 1.95, viewValue: '95%'}, {value: 2, viewValue: '100%'}
    ];

    // Insert Rates Props
    private rateCardID: number;
    private fileName: string;
    private disableUploadBoolean = true;
    
    finalRatecardObj;
    finalRatecardPreviewObj = [];
    ratesPreviewObj = [];

    constructor(
        public dialogRef: MatDialogRef <RateCardsTableComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: any,
        private papa: PapaParseService,
        private formBuilder: FormBuilder, 
        private rateCardsService: RateCardsService, 
        private ratesService: RatesService
    ) {};

    ngOnInit() {
        this.get_carrier();
        this.get_rateCard();

        this.carrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['', Validators.required]
        });
        this.ratecardFormGroup = this.formBuilder.group({
            ratecardCtrl: ['', Validators.required],
        });
        this.percentFormGroup = this.formBuilder.group({
            teleUCheckboxCtrl: [false],
            teleUPercentCtrl: [0],
            privateCheckboxCtrl: [false],
            privatePercentCtrl: [1.5]
        });
        this.uploadRatesFormGroup = this.formBuilder.group({
            uploadRatesCtrl: ['', Validators.required]
        });

        this.percentFormGroup.controls.teleUCheckboxCtrl.setValue(false);
        this.percentFormGroup.controls.privateCheckboxCtrl.setValue(false);
    };

    /*
        ~~~~~~~~~~ API service ~~~~~~~~~~
    */
    get_carrier(): void {
        this.rateCardsService.get_CarrierNames()
            .subscribe(
                data => { this.carrierObj = data; },
                error => { console.log(error); }
            );
    };

    get_rateCard(): void {  // subscribe to service and get carrier names
        this.rateCardsService.get_RateCard()
            .subscribe(
                data => { this.ratecardObj = data; },
                error => { console.log(error); },
            );
    };

    post_addRates(): void {
        this.rateCardsService.post_AddRateCard(this.finalRatecardObj)
            .subscribe(res => console.log(res));
    }

    /*
        ~~~~~~~~~~ Extract data ~~~~~~~~~~
    */
    extract_CarrierName(): string {
        for(let i = 0; i<this.carrierObj.length; i++) {
            if ( this.carrierObj[i].id === this.input_getCarrierId() ) {
                return this.carrierObj[i].name;
            }
        }
    };

    /*
        ~~~~~~~~~~ Get data from input ~~~~~~~~~~
    */
    input_getCarrierId(): number {
        return this.carrierFormGroup.get('carrierCtrl').value;
    };

    input_getRateCardName(): number {
        return this.ratecardFormGroup.get('ratecardCtrl').value;
    };

    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
    checkBoxValueTeleU(): boolean {
        return !this.percentFormGroup.get('teleUCheckboxCtrl').value    
    }

    checkBoxValuePrivate(): boolean {
        return !this.percentFormGroup.get('privateCheckboxCtrl').value
    }

    changeListenerUploadBtn(event): void { // listens on change event, if file uploaded passes csv-parser check, change flag for button
        if (event.target.files && event.target.files[0]) {
            const csvFile = event.target.files[0];
            this.fileName = csvFile.name;
            this.papaParse(csvFile);
            this.disableUploadBoolean = false; // pass boolean flag for valdation
        } else {
            this.disableUploadBoolean = true;
        }
    }

    uploadValidator(boolean): boolean { // pass into step 2's [disable] to control button disable
        if (this.disableUploadBoolean === true) {
            return true;
        }
        if ( this.disableUploadBoolean === false ) {
            return false;
        }
    }

    /*
        ~~~~~~~~~~~ Construct JSON ~~~~~~~~~~
    */
    construct_ratecardObj() {
        this.finalRatecardObj = {
            name: this.ratecardFormGroup.get('ratecardCtrl').value,
            carrier_id: this.input_getCarrierId(),
            addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
            teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
            asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
            privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
            rates: []
        };

        this.finalRatecardPreviewObj.push( {
            name: this.ratecardFormGroup.get('ratecardCtrl').value,
            carrier_id: this.input_getCarrierId(),
            addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
            teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
            asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
            privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
        },)
        console.log(this.finalRatecardObj);
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    closeDialog(): void {
        this.dialogRef.close();
    }

    click_addRates(): void {
        this.post_addRates();
        this.closeDialog();
    }

    /*
        ~~~~~~~~~~ CSV Parser ~~~~~~~~~~
    */
    papaParse(csvFile): void { // Parse csv string into JSON
        this.papa.parse(csvFile, {
            complete: (results) => {
                console.log('Parsed: ', results);
                const data = results.data;
                this.profileSorter(data);
            }
        });
    }

    profileSorter(data) { // Based on the Carrier Name match the String to trigger the right profile
        const currentCarrierName = this.extract_CarrierName();
        if (currentCarrierName === 'PowerNet Global') {
            console.log('using Power Net Global Profile');
            this.powerNetGlobalProfile(data);
        }
        if (currentCarrierName === 'VoxBeam') {
            console.log('using VoxBeam Profile');
            this.voxBeamProfile(data);
        }
        if (currentCarrierName === 'Alcazar Networks Inc') {
            console.log('using Alcazar Networks Inc Profile');
            this.alcazarNetworksProfile(data);
        }
        if (currentCarrierName === 'Bankai Group') {
            this.bankaiGroupProfile(data);
        }
        if (currentCarrierName === 'PCCW Global' ) {
            console.log('using PCCW Global Profile');
            this.pccwGlobalProfile(data);
        }
        if (currentCarrierName === 'StarSSip LLC') {
            console.log('using Starsipp Profile')
            this.starsippProfile(data);
        }
        if (currentCarrierName === 'Teleinx') {
            console.log('using Teleinx Profile');
            this.teleinxProfile(data);
        }
        if (currentCarrierName === 'VoiPlatinum Portal') {
            console.log('using VoiPlatinum Profile');
            this.voiPlatinumProfile(data);
        }
        if (currentCarrierName === 'VOIP Routes') {
            console.log('using VOIP Routes Profile');
            this.voipRoutesProfile(data);
        }
        else {
            return;
        }
    }

    generateRateObj(destination, prefix, buyrate, sellrate): void { // Create a rate obj for POST and seperately for preview
        this.finalRatecardObj.rates.push( 
            { destination: destination, 
                prefix: prefix, 
                buy_rate: buyrate, 
                buy_rate_minimum: buyrate, 
                buy_rate_increment: 0,
                sell_rate: sellrate,
                sell_rate_minimum: sellrate,
                sell_rate_increment: 0
            }, 
        );
        this.ratesPreviewObj.push(
            { destination: destination, 
                prefix: prefix, 
                buy_rate: buyrate, 
                buy_rate_minimum: buyrate, 
                buy_rate_increment: 0,
                sell_rate: sellrate, 
                sell_rate_minimum: sellrate,
                sell_rate_increment: 0
            }, 
        );
    }

    powerNetGlobalProfile(data) {
        const dataSliced = data.slice(3);

        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") { //if quotes are detected in char[0] slice first and last char.
                    destination = destination.slice(1, -1);
                }if(prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][2].slice(1) * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    voxBeamProfile(data) {
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
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    alcazarNetworksProfile(data) {
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
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    bankaiGroupProfile(data) {
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
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    pccwGlobalProfile(data) {
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
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    starsippProfile(data) {
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
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    teleinxProfile(data) {
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
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        } 
    }

    voiPlatinumProfile(data) {
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
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        } 
    }

    voipRoutesProfile(data) {
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
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        } 
    }

}
