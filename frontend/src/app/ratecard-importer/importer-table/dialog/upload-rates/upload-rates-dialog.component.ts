import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GridApi } from 'ag-grid';

import { PapaParseService } from 'ngx-papaparse';

import { ImporterTableComponent } from './../../importer-table.component';
import { ImporterService } from './../../../services/importer.api.service';
import { ImporterSharedService } from './../../../services/importer.shared.service';
import { TrunksService } from './../../../../trunks/services/trunks.api.service';
import { SnackbarSharedService } from './../../../../global-service/snackbar.shared.service';
import { ToggleButtonStateService } from './../../../../global-service/buttonStates.shared.service';

@Component({
  selector: 'app-upload-rates',
  templateUrl: './upload-rates-dialog.component.html',
  styleUrls: ['./upload-rates-dialog.component.scss']
})
export class UploadRatesDialogComponent implements OnInit {

    // event
    event_passTrunkId = new EventEmitter;

    // Form Group var
    private carrierFormGroup: FormGroup;
    private ratecardFormGroup: FormGroup;
    private percentFormGroup: FormGroup;
    private uploadRatesFormGroup: FormGroup;

    // Ag Grid row & column defs
    private rowData;
    private columnDefs;

    // Ag grid api & ui 
    private gridApi: GridApi;
    private gridSelectionStatus: number;

    // DB Objects
    private carrierObj = [];
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

    private finalRatecardObj;
    private finalRatecardPreviewObj = [];
    private ratesPreviewObj = [];

    // Internal Service
    private postTableArr;

    constructor(
        public dialogRef: MatDialogRef <ImporterTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private papa: PapaParseService,
        private formBuilder: FormBuilder,
        private importerService: ImporterService,
        private importerSharedService: ImporterSharedService,
        private trunksService: TrunksService,
        private snackbarSharedService: SnackbarSharedService,
        private toggleButtonStateService: ToggleButtonStateService
    ) {}

    ngOnInit() {
        this.get_carrier();
        this.get_trunks();

        this.columnDefs = this.createColumnDefs();

        this.carrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['', Validators.required]
        });
        this.ratecardFormGroup = this.formBuilder.group({
            ratecardCtrl: ['', Validators.required],
        });
        this.percentFormGroup = this.formBuilder.group({
            teleUCheckboxCtrl: [false],
            teleUPercentCtrl: [0],
            privateCheckboxCtrl: [true],
            privatePercentCtrl: [1.5]
        });
        this.uploadRatesFormGroup = this.formBuilder.group({
            uploadRatesCtrl: ['', Validators.required]
        });

        this.percentFormGroup.controls.teleUCheckboxCtrl.setValue(false);
        this.percentFormGroup.controls.privateCheckboxCtrl.setValue(true);
    }

    /*
        ~~~~~~~~~~ API service ~~~~~~~~~~
    */
    get_carrier(): void {
        this.importerService.get_CarrierNames()
            .subscribe(
                data => { this.carrierObj = data; },
                error => { console.log(error); }
            );
    }

    get_trunks(): void {
        this.trunksService.get_allTrunks()
        .subscribe(
            data => { this.rowData = data; },
            error => { console.log(error); }
        );
    }

    post_addRates(): void {
        
        this.importerService.post_AddRateCard(this.finalRatecardObj)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Ratecards successful imported.', 3000);
                    }
                },
                error => {
                    console.log(error);
                    this.snackbarSharedService.snackbar_error('Ratecards failed to import.', 3000);
                }
            );
    }

    /*
        ~~~~~~~~~~ Grid Initiation ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Trunk Name', field: 'trunk_name',
                checkboxSelection: true, width: 350
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
            }
        ];
    }

    /*
        ~~~~~~~~~~ Extract data ~~~~~~~~~~
    */
    extract_CarrierName(): string {
        for (let i = 0; i < this.carrierObj.length; i++) {
            if ( this.carrierObj[i].id === this.input_getCarrierId() ) {
                return this.carrierObj[i].name;
            }
        }
    }

    /*
        ~~~~~~~~~~ Get data from input ~~~~~~~~~~
    */
    input_getCarrierId(): number {
        return this.carrierFormGroup.get('carrierCtrl').value;
    }

    input_getRateCardName(): number {
        return this.ratecardFormGroup.get('ratecardCtrl').value;
    }

    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
    // For button Toggle
    rowSelected(): void { // Toggle button boolean if rowSelected > 0
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    }

    toggleButtonStates(): boolean {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    }

    checkBoxValueTeleU(): boolean {
        return !this.percentFormGroup.get('teleUCheckboxCtrl').value;
    }

    checkBoxValuePrivate(): boolean {
        return !this.percentFormGroup.get('privateCheckboxCtrl').value;
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
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~
    */
    aggrid_addRatecard() {
        this.importerSharedService.currentPostTableObj.subscribe( data => { this.postTableArr = data; });
        this.event_passTrunkId.emit(this.gridApi.getSelectedRows[0]);
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
        },
        );
        console.log(this.finalRatecardObj);
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    closeDialog(): void {
        this.dialogRef.close();
    }

    passTrunkId () {
        this.event_passTrunkId.emit(this.gridApi.getSelectedRows()[0].id);
    }

    click_addRates(): void {
        this.passTrunkId();
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
        if (currentCarrierName === 'Alcazar') {
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
        if (currentCarrierName === 'StarSSip') {
            console.log('using Starsipp Profile');
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
        if (currentCarrierName === 'Megatel') {
            console.log('uing Megatel Profile');
            this.megatelProfile(data);
        }
        if (currentCarrierName === 'Telia Carrier') {
            console.log('using Telia Carrier Profile');
            this.teliaCarrierProfile(data);
        }
        if (currentCarrierName === 'All World Communications') {
            console.log('using All World Communications Profile');
            this.allWorldCommunications(data);
        }
        if (currentCarrierName === '') {
            console.log('using Default Profile');
            this.defaultProfile(data);
        }
    }

    generateRateObj(destination, prefix, buyrate, sellrate): void { // Create a rate obj for POST and seperately for preview
        this.finalRatecardObj.rates.push(
            { destination: destination,
                prefix: prefix,
                buy_rate: buyrate,
                buy_rate_minimum: 1,
                buy_rate_increment: 1,
                sell_rate: sellrate,
                sell_rate_minimum: 60,
                sell_rate_increment: 60
            },
        );
        this.ratesPreviewObj.push(
            { destination: destination,
                prefix: prefix,
                buy_rate: buyrate,
                buy_rate_minimum: 1,
                buy_rate_increment: 1,
                sell_rate: sellrate,
                sell_rate_minimum: 60,
                sell_rate_increment: 60
            },
        );
    }

    defaultProfile(data): void {
        const dataSliced = data.slice(1);
        for ( let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][0];
            const prefix: string = dataSliced[i][1];
            const buyrate: number = dataSliced[i][2].slice(1) * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    powerNetGlobalProfile(data): void {
        const dataSliced = data.slice(3);
        for (let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][0];
            const prefix: string = dataSliced[i][1];
            const buyrate: number = dataSliced[i][2].slice(1) * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    voxBeamProfile(data) {
        const dataSliced = data.slice(1);
        for (let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][2];
            const prefix: string = dataSliced[i][0];
            const buyrate: number = dataSliced[i][3] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    alcazarNetworksProfile(data) {
        const dataSliced = data.slice(7);

        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if(destination.charAt(0) === '"' || destination.charAt(0) === "'") {
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
        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                    destination = destination.slice(1, -1);
                }if (prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][3] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    pccwGlobalProfile(data) {
        const dataSliced = data.slice(13);
        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if (destination.charAt(0) === '"' || destination.charAt(0) === "'") { 
                    destination = destination.slice(1, -1);
                }if (prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][4] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    starsippProfile(data) {
        const dataSliced = data.slice(1);
        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][1];
            let prefix: string = dataSliced[i][2];
                if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                    destination = destination.slice(1, -1);
                }if (prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][3] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    teleinxProfile(data) {
        const dataSliced = data.slice(1);
        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][1];
            let prefix: string = dataSliced[i][2];
                if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                    destination = destination.slice(1, -1);
                }if (prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][3] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    voiPlatinumProfile(data) {
        const dataSliced = data.slice(1, -1);
        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][0];
            let prefix: string = dataSliced[i][1];
                if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                    destination = destination.slice(1, -1);
                }
                if (prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][2] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    voipRoutesProfile(data) {
        const dataSliced = data.slice(9);
        for (let i = 0; i < dataSliced.length; i++) {
            let destination: string = dataSliced[i][1];
            let prefix: string = dataSliced[i][0];
                if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                    destination = destination.slice(1, -1);
                }
                if (prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
                    prefix = prefix.slice(1, -1);
                }
            const buyrate: number = dataSliced[i][2] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    megatelProfile(data) { 
        const dataSliced = data.slice(2);
        for (let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][0];
            const prefix: string = dataSliced[i][2];
            const buyrate: number = dataSliced[i][4] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    teliaCarrierProfile(data) { 
        const dataSliced = data.slice(18);
        for (let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][1];
            const prefix: string = dataSliced[i][2];
            const buyrate: number = dataSliced[i][3] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
        console.log(this.finalRatecardObj);
    }

    allWorldCommunications(data) {
        const dataSliced = data.slice(9, -1);
        for (let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][3];
            const prefix: string = dataSliced[i][2];
            const buyrate: number = dataSliced[i][4] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

}
