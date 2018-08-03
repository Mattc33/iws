import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridApi } from 'ag-grid';

import { PapaParseService } from 'ngx-papaparse';

import { ImporterTableComponent } from '../../importer-table.component';
import { ImporterService } from '../../../../../../shared/api-services/ratecard/importer.api.service';
import { CarrierService } from '../../../../../../shared/api-services/carrier/carrier.api.service';
import { ImporterSharedService } from '../../../../../../shared/services/ratecard/importer.shared.service';
import { TrunksService } from '../../../../../../shared/api-services/trunk/trunks.api.service';
import { SnackbarSharedService } from '../../../../../../shared/services/global/snackbar.shared.service';
import { ToggleButtonStateService } from '../../../../../../shared/services/global/buttonStates.shared.service';

@Component({
  selector: 'app-upload-rates',
  templateUrl: './upload-rates-dialog.component.html',
  styleUrls: ['./upload-rates-dialog.component.scss']
})
export class UploadRatesDialogComponent implements OnInit {

    // event
    event_passTrunkId = new EventEmitter;

    // Form Group var
    carrierFormGroup: FormGroup;
    ratecardFormGroup: FormGroup;
    percentFormGroup: FormGroup;
    uploadRatesFormGroup: FormGroup;

    // * Ag Grid row & column defs for trunks
    rowData; columnDefs;

    // Ag grid api & ui
    gridApi: GridApi;
    gridSelectionStatus: number;

    // * DB Objects
    carrierObj = [];
    currentRateCardNames = []; // rate cards obj populated by method  currentRateCardList()
    ratecardTier = [
        {value: 'standard', viewValue: 'Silver'},
        {value: 'standard', viewValue: 'Standard'},
        {value: 'premium', viewValue: 'Gold'},
        {value: 'premium', viewValue: 'Premium'},
        {value: 'premium', viewValue: 'Platinum'},
    ];

    // Insert Rates Props
    rateCardID: number;
    fileName: string;
    disableUploadBoolean = true;

    finalRatecardObj;
    finalRatecardPreviewObj = [];
    ratesPreviewObj = [];

    // Internal Service
    postTableArr;
    totalRatesProcessed = 0;

    constructor(
        public dialogRef: MatDialogRef <ImporterTableComponent>,
        private _papa: PapaParseService,
        private _formBuilder: FormBuilder,
        private _importerService: ImporterService,
        private _carrierService: CarrierService,
        private _importerSharedService: ImporterSharedService,
        private _trunksService: TrunksService,
        private _snackbarSharedService: SnackbarSharedService,
        private _toggleButtonStateService: ToggleButtonStateService
    ) {
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.get_trunks();
        this.get_carriers();
        this.uploadRatecardFormBuilder();

        this.percentFormGroup.controls.teleUCheckboxCtrl.setValue(false);
        this.percentFormGroup.controls.privateCheckboxCtrl.setValue(true);
    }

    // ================================================================================
    // * API Services
    // ================================================================================
    get_carriers(): void {
        this._carrierService.get_carriers()
            .subscribe(
                data => { this.carrierObj = data; console.log(data); },
                error => { console.log(error); }
            );
    }

    get_trunks(): void {
        this._trunksService.get_allTrunks()
        .subscribe(
            data => { this.rowData = data; },
            error => { console.log(error); }
        );
    }

    post_addRates(): void {
        this._importerService.post_AddRateCard(this.finalRatecardObj)
            .subscribe(
                (resp) => {
                    for ( let i = 0; i < resp.length; i++ ) { this.totalRatesProcessed += resp[i].rates.length; }
                    if ( resp.status === 200 ) {
                        this._snackbarSharedService.snackbar_success('Ratecards successful imported.', 2000);
                    }
                },
                error => {
                    console.log(error);
                    this._snackbarSharedService.snackbar_error('Ratecards failed to import.', 2000);
                }
            );
    }

    // ================================================================================
    // * AG Grid Init
    // ================================================================================
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

    // ================================================================================
    // * Forms Builder
    // ================================================================================
    uploadRatecardFormBuilder() {
        this.buildRatecardFormGroup();
        this.buildPercentFormGroup();
        this.buildUploadRatesFormGroup();
    }

    buildRatecardFormGroup() {
        return this.ratecardFormGroup = this._formBuilder.group({
            carrierCtrl: ['', Validators.required],
            ratecardCtrl: ['', Validators.required],
            ratecardTierCtrl: ['', Validators.required]
        });
    }

    buildPercentFormGroup() {
        return this.percentFormGroup = this._formBuilder.group({
            teleUCheckboxCtrl: [false],
            teleUPercentCtrl: [1, Validators.pattern('^[0-9]')],
            privateCheckboxCtrl: [true],
            privatePercentCtrl: [1.02, Validators.pattern('^[0-9]')]
        });
    }

    buildUploadRatesFormGroup() {
        return this.uploadRatesFormGroup = this._formBuilder.group({
            uploadRatesCtrl: ['']
        });
    }

    // ================================================================================
    // * Input data
    // ================================================================================
    input_getCarrierId(): number {
        return this.ratecardFormGroup.get('carrierCtrl').value;
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
        return this._toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
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

    uploadValidator(): boolean { // pass into step 2's [disable] to control button disable
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
        this._importerSharedService.currentPostTableObj.subscribe( data => { this.postTableArr = data; });
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
        this._papa.parse(csvFile, {
            complete: (results) => {
                console.log('Parsed: ', results);
                const data = results.data;
                this.profileSorter(data);
            }
        });
    }

    profileSorter(data) { // Based on the Carrier Name match the String to trigger the right profile
        this.defaultProfile(data);
        this._importerSharedService.changeRatesCSVAmount(this.ratesPreviewObj.length); // display length of rates array
    }

    generateRateObj(destination, prefix, buyrate, sellrate): void { // Create a rate obj for POST and seperately for preview
        let destinationRemoveBadChar = destination.replace(/\\|'|\\'/ , '');
        if  (destinationRemoveBadChar.length > 64) {destinationRemoveBadChar = destinationRemoveBadChar.substring(0, 64); }

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
        const dataSliced = data.slice(1);
        for ( let i = 0; i < dataSliced.length; i++) {
            const prefix: string = dataSliced[i][0];
            const destination: string = dataSliced[i][1];
            const buyrate: number = dataSliced[i][2] * 1;
            const sellrate: number = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    }
}
