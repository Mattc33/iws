import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GridApi } from 'ag-grid';

import { PapaParseService } from 'ngx-papaparse';

import { ImporterTableComponent } from './../../importer-table.component';
import { ImporterService } from './../../../services/importer.api.service';
import { ImporterSharedService } from './../../../services/importer.shared.service';
import { TrunksService } from './../../../../../trunks/services/trunks.api.service';
import { SnackbarSharedService } from './../../../../../shared/services/global/snackbar.shared.service';
import { ToggleButtonStateService } from './../../../../../shared/services/global/buttonStates.shared.service';

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

    private ratecardTier = [
        {value: 'standard', viewValue: 'Silver'},
        {value: 'standard', viewValue: 'Standard'},
        {value: 'premium', viewValue: 'Gold'},
        {value: 'premium', viewValue: 'Premium'},
        {value: 'premium', viewValue: 'Platinum'},
    ];

    private teleuPercent = 0;

    // Insert Rates Props
    private rateCardID: number;
    private fileName: string;
    private disableUploadBoolean = true;

    private finalRatecardObj;
    private finalRatecardPreviewObj = [];
    private ratesPreviewObj = [];

    // Internal Service
    private postTableArr;
    private totalRatesProcessed = 0;

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
            ratecardTierCtrl: ['', Validators.required]
        });
        this.percentFormGroup = this.formBuilder.group({
            teleUCheckboxCtrl: [false],
            teleUPercentCtrl: [1, Validators.pattern('^[0-9]')],
            privateCheckboxCtrl: [true],
            privatePercentCtrl: [1.02, Validators.pattern('^[0-9]')]
        });
        this.uploadRatesFormGroup = this.formBuilder.group({
            uploadRatesCtrl: ['']
        });

        this.percentFormGroup.controls.teleUCheckboxCtrl.setValue(false);
        this.percentFormGroup.controls.privateCheckboxCtrl.setValue(true);
    }

    // ================================================================================
    // API Services
    // ================================================================================
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
                (resp) => {
                    for ( let i = 0; i < resp.length; i++ ) { this.totalRatesProcessed += resp[i].rates.length; }
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Ratecards successful imported.', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this.snackbarSharedService.snackbar_error('Ratecards failed to import.', 2000);
                }
            );
    }

    /*
        ~~~~~~~~~~ Grid Init ~~~~~~~~~~
    */
    on_GridReady(params): void {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'Trunk Name', field: 'trunk_name',
                checkboxSelection: true, width: 350,
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
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

    input_getMarkupPrivate(): number {
        return this.percentFormGroup.get('privatePercentCtrl').value;
    }

    input_getMarkupTeleu(): number {
        return this.percentFormGroup.get('teleUPercentCtrl').value;
    }

    getMarkupTeleuAsPercent(): any {
        if ( this.input_getMarkupTeleu() > 0 ) {
            const value = ((this.input_getMarkupTeleu() * 100) - 100).toFixed(4);
            return value;
        } else {
            return 0;
        }
    }

    getMarkupPrivateAsPercent(): any {
        if ( this.input_getMarkupTeleu() > 0 ) {
            const value = ((this.input_getMarkupPrivate() * 100) - 100).toFixed(4);
            return value;
        } else {
            return 0;
        }
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

    // ================================================================================
    // Construct JSON
    // ================================================================================
    clickConstructJson() {
        this.pushFinalRatecard();
        this.pushFinalRatecardPreview();
    }

    pushFinalRatecard() {
        // * push final ratecard obj to a global var, so the api can subscribe on
        this.finalRatecardObj = {
            name: this.ratecardFormGroup.get('ratecardCtrl').value + ' - ' + this.ratecardFormGroup.get('ratecardTierCtrl').value,
            carrier_id: this.input_getCarrierId(),
            addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
            teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
            asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
            privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
            tier: this.ratecardFormGroup.get('ratecardTierCtrl').value,
            rates: []
        };
    }

    pushFinalRatecardPreview() {
        // * remove the last entry in the object
        this.finalRatecardPreviewObj.push(
            {
                name: this.ratecardFormGroup.get('ratecardCtrl').value + ' - ' + this.ratecardFormGroup.get('ratecardTierCtrl').value,
                carrier_id: this.input_getCarrierId(),
                addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
                teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
                asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
                privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
                tier: this.ratecardFormGroup.get('ratecardTierCtrl').value,
            }
        );
    }

    // ================================================================================
    // Dialog
    // ================================================================================
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
        if (currentCarrierName.toLowerCase() === 'powernet global') {
            console.log('using Power Net Global Profile');
            this.powerNetGlobalProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'voxbeam') {
            console.log('using VoxBeam Profile');
            this.voxBeamProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'alcazar') {
            console.log('using Alcazar Networks Inc Profile');
            this.alcazarNetworksProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'bankai group') {
            this.bankaiGroupProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'pccw global' ) {
            console.log('using PCCW Global Profile');
            this.pccwGlobalProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'starssip') {
            console.log('using Starsipp Profile');
            this.starsippProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'teleinx') {
            console.log('using Teleinx Profile');
            this.teleinxProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'voiplatinum portal') {
            console.log('using VoiPlatinum Profile');
            this.voiPlatinumProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'voip routes') {
            console.log('using VOIP Routes Profile');
            this.voipRoutesProfile(data);
        } 
        if (currentCarrierName.toLowerCase() === 'megatel') {
            console.log('uing Megatel Profile');
            this.megatelProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'telia carrier') {
            console.log('using Telia Carrier Profile');
            this.teliaCarrierProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'all world communications') {
            console.log('using All World Communications Profile');
            this.allWorldCommunications(data);
        }
        if (currentCarrierName.toLowerCase() === 'kftel') {
            console.log('using KFTel Profile');
            this.kftelProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'pst') {
            console.log('using PST profile');
            this.pstProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'default') {
            console.log('using Default Profile');
            this.defaultProfile(data);
        }

        this.importerSharedService.changeRatesCSVAmount(this.ratesPreviewObj.length);
    }

    generateRateObj(destination, prefix, buyrate, sellrate): void { // Create a rate obj for POST and seperately for preview
        let destinationRemoveBadChar = destination.replace(/\\|'|\\'/ , '');
        if  (destinationRemoveBadChar.length > 64) {destinationRemoveBadChar = destinationRemoveBadChar.substring(0, 64);}

        this.finalRatecardObj.rates.push(
            {   destination: destinationRemoveBadChar,
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
            { destination: destinationRemoveBadChar,
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
        console.log('test');
        const dataSliced = data.slice(1);
        for ( let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][0];
            const prefix: string = dataSliced[i][1];
            const buyrate: number = dataSliced[i][2] * 1;
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
                if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                    destination = destination.slice(1, -1);
                }if (prefix.charAt(0) === '"' || prefix.charAt(0) === "'" ) {
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
                } if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'' ) {
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
                if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') { 
                    destination = destination.slice(1, -1);
                } if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'' ) {
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
                if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                    destination = destination.slice(1, -1);
                } if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'' ) {
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
                if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                    destination = destination.slice(1, -1);
                } if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'' ) {
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
                if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                    destination = destination.slice(1, -1);
                }
                if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'' ) {
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
                if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                    destination = destination.slice(1, -1);
                }
                if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'' ) {
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

    kftelProfile(data) {
        const dataSliced = data.slice(1, -9);
        for (let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][0];
            const prefix: string = dataSliced[i][1];
            const buyrate: number = dataSliced[i][2] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

    pstProfile(data) {
        const dataSliced = data.slice(5, -4);
        for (let i = 0; i < dataSliced.length; i++) {
            const destination: string = dataSliced[i][1];
            const prefix: string = dataSliced[i][0];
            const buyrate: number = dataSliced[i][2] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }

}
