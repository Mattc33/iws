
import { Component, OnInit, EventEmitter } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { GridApi } from 'ag-grid'

import { PapaParseService } from 'ngx-papaparse'

import { ImporterService } from '../../../../../../shared/api-services/ratecard/importer.api.service'
import { CarrierService } from '../../../../../../shared/api-services/carrier/carrier.api.service'
import { TrunksService } from '../../../../../../shared/api-services/trunk/trunks.api.service'

import { ImporterTableComponent } from '../../importer-table.component'
import { RatecardImporterUtils } from './../../../../../../shared/utils/ratecard/rate-card-importer.utils'
import { ImporterSharedService } from '../../../../../../shared/services/ratecard/importer.shared.service'

import { SnackbarSharedService } from '../../../../../../shared/services/global/snackbar.shared.service'
import { ToggleButtonStateService } from '../../../../../../shared/services/global/buttonStates.shared.service'

@Component({
  selector: 'app-upload-rates',
  templateUrl: './upload-rates-dialog.component.html',
  styleUrls: ['./upload-rates-dialog.component.scss']
})
export class UploadRatesDialogComponent implements OnInit {

    event_passTrunkId = new EventEmitter // passing trunkId to? where

    // ! String Interpolation Values
    numberOfRates: number = 0
    fileName: string

    // ! Reactive Form
    // * Form Groups
    carrierFormGroup: FormGroup
    ratecardFormGroup: FormGroup
    percentFormGroup: FormGroup
    uploadRatesFormGroup: FormGroup

    // * Form Options
    ratecardTier: Array<{value: string, viewValue: string}> = [
        {value: 'standard', viewValue: 'Silver'},
        {value: 'standard', viewValue: 'Standard'},
        {value: 'premium', viewValue: 'Gold'},
        {value: 'premium', viewValue: 'Premium'},
        {value: 'premium', viewValue: 'Platinum'},
    ]

    // * Form Values
    ratesList: Array<any> = []
    postBody: object

    // * Form Disabled
    uploadRateStepNextBtn = false

    // ! AG Grid
    // * Ag Grid row & column defs for trunks
    rowData: Array<any>
    columnDefs: Array<any>

    // * Ag grid api & ui
    gridApi: GridApi
    gridSelectionStatus: number

    // * DB Objects
    carrierObj = []
    currentRateCardNames = [] // rate cards obj populated by method  currentRateCardList()

    disableUploadBoolean = true

    // Internal Service
    postTableArr
    totalRatesProcessed = 0;

    constructor(
        public dialogRef: MatDialogRef <ImporterTableComponent>, // referencing parent component
        private _papa: PapaParseService,
        private _formBuilder: FormBuilder,
        private _importerService: ImporterService,
        private _carrierService: CarrierService,
        private _importerSharedService: ImporterSharedService,
        private _trunksService: TrunksService,
        private _snackbarSharedService: SnackbarSharedService,
        private _toggleButtonStateService: ToggleButtonStateService,
        private _ratecardImporterUtils: RatecardImporterUtils
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

    post_addRates(postBody: object): void {
        this._importerService.post_AddRateCard(postBody)
            .subscribe(
                (resp) => {
                    // for ( let i = 0; i < resp.length; i++ ) { this.totalRatesProcessed += resp[i].rates.length; }
                    if ( resp.status === 200 ) {
                        console.log(resp)
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
            return ((this.input_getMarkupTeleu() * 100) - 100).toFixed(4);
        } else {
            return 0;
        }
    }

    getMarkupPrivateAsPercent(): any {
        if ( this.input_getMarkupTeleu() > 0 ) {
            return ((this.input_getMarkupPrivate() * 100) - 100).toFixed(4);
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

    uploadValidator(): boolean { // pass into step 2's [disable] to control button disable
        if (this.disableUploadBoolean === true) {
            return true;
        }
        if ( this.disableUploadBoolean === false ) {
            return false;
        }
    }

    // ================================================================================
    // * Construct JSON
    // ================================================================================
    formPostBody() {
        const ratecardBody = {
            name: this.ratecardFormGroup.get('ratecardCtrl').value + ' - ' + this.ratecardFormGroup.get('ratecardTierCtrl').value,
            carrier_id: this.input_getCarrierId(),
            addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
            teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
            asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
            privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
            tier: this.ratecardFormGroup.get('ratecardTierCtrl').value,
            rates: this.ratesList
        }
        console.log(ratecardBody)
        this.post_addRates(ratecardBody)
        // this.postBody = ratecardBody
    }
    // ================================================================================
    // * Dialog
    // ================================================================================
    closeDialog(): void {
        this.dialogRef.close()
    }

    passTrunkId () {
        this.event_passTrunkId.emit(this.gridApi.getSelectedRows()[0].id)
    }

    click_addRates(): void {
        this.passTrunkId()
        this.closeDialog()
    }

    // ================================================================================
    // * CSV Parser
    // ================================================================================
    onUploadCsv(e): void { // listens on change event, if file uploaded passes csv-parser check, change flag for button
        if (e.target.files && e.target.files[0]) {
            const csvFile = e.target.files[0];
            this.fileName = csvFile.name;
            this.papaParse(csvFile);
        }
    }

    papaParse(csvArr: File): void { // Parse csv string into JSON
        this._papa.parse(csvArr, {
            complete: results => {
                console.log('Parsed: ', results)
                const data = results.data
                this.profileSorter(data)
            }
        })
    }

    // ! this method should be on a web worker
    profileSorter(data: Array<any>): void { // Based on the Carrier Name match the String to trigger the right profile
        new Promise( (resolve, reject) => {
            resolve(this.defaultProfile(data))
        })
        .then( rateList => {
            this.numberOfRates = this.ratesList.length
        })
        .then( rateList => {
            this.formPostBody()
        })
    }

    defaultProfile(data: Array<any>): Array<any> {
        const dataNoHeaders = data.slice(1) // remove headers
        const rateList = dataNoHeaders.map( eaRate => {
            return {
                prefix: eaRate[0],
                destination: eaRate[1],
                buy_rate: parseFloat(eaRate[2]),
                buy_rate_minimum: 1,
                buy_rate_increment: 1,
                sell_Rate: parseFloat(eaRate[2]),
                sell_rate_minimum: 60,
                sell_rate_increment: 60,
                start_ts: this._ratecardImporterUtils.dateToEpoch(eaRate[3]) // some util function that parses dates
            }
        })
        this.ratesList = rateList
        return dataNoHeaders
    }
}
