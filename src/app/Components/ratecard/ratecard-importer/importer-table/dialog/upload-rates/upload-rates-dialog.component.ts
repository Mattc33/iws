import { Component, OnInit, EventEmitter } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { GridApi } from 'ag-grid'
import { PapaParseService } from 'ngx-papaparse'
import { ImporterService } from '../../../../../../shared/api-services/ratecard/importer.api.service'
import { CarrierService } from '../../../../../../shared/api-services/carrier/carrier.api.service'
import { TrunksService } from '../../../../../../shared/api-services/trunk/trunks.api.service'
import { ImporterTableComponent } from '../../importer-table.component'
import { ImporterSharedService } from '../../../../../../shared/services/ratecard/importer.shared.service'
import { SnackbarSharedService } from '../../../../../../shared/services/global/snackbar.shared.service'
import { ToggleButtonStateService } from '../../../../../../shared/services/global/buttonStates.shared.service'

import DateUtils from '../../../../../../shared/utils/date/date.utils'
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
    carrierList: [{}]
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
    disableUploadBoolean = true

    // ! AG Grid
    // * Ag Grid row & column defs for trunks
    rowData: Array<any>
    columnDefs: Array<any>

    // * Ag grid api & ui
    gridApi: GridApi
    gridSelectionStatus: number

    constructor(
        public _dialogRef: MatDialogRef <ImporterTableComponent>, // referencing parent component
        private _papa: PapaParseService,
        private _formBuilder: FormBuilder,
        private _importerService: ImporterService,
        private _carrierService: CarrierService,
        private _importerSharedService: ImporterSharedService,
        private _trunksService: TrunksService,
        private _snackbarSharedService: SnackbarSharedService,
        private _toggleButtonStateService: ToggleButtonStateService
    ) {
        this.columnDefs = this.createColumnDefs()
    }

    ngOnInit() {
        this.getTrunks()
        this.getCarriers()
        this.uploadRatecardFormBuilder()
        this.percentFormGroup.controls.teleUCheckboxCtrl.setValue(false)
        this.percentFormGroup.controls.privateCheckboxCtrl.setValue(true)
    }

    // ================================================================================
    // * API Services
    // ================================================================================
    getCarriers(): void {
        this._carrierService.get_carriers()
            .subscribe(
                carrierList => this.carrierList = carrierList,
                error => console.log(error) 
            )
    }

    getTrunks(): void {
        this._trunksService.get_allTrunks()
            .subscribe(
                trunkList => this.rowData = trunkList,
                error => console.log(error)
            )
    }

    postAddRates(): void {
        this._importerService.post_AddRateCard(this.postBody)
            .subscribe(
                ratecardGroup => {
                    let prefixCount: number = 0
                    ratecardGroup.forEach( eaRatecard => {
                        prefixCount += eaRatecard.rates.length
                    })
                    this._importerSharedService.changeNumberOfRatesInResponse(prefixCount)
                    // this._importerSharedService.changeRatesInResponse(responseRates)
                    this._snackbarSharedService.snackbar_success('Ratecards successful imported.', 2000)
                },
                error => {
                    console.log(error)
                    this._snackbarSharedService.snackbar_error('Ratecards failed to import.', 2000)
                }
            )
    }

    // ================================================================================
    // * AG Grid Init
    // ================================================================================
    onGridReady(params): void {
        this.gridApi = params.api
        params.api.sizeColumnsToFit()
    }

    createColumnDefs(): Array<{}> {
        return [
            {
                headerName: 'Trunk Name', field: 'trunk_name',
                checkboxSelection: true, width: 350,
                cellStyle: { 'border-right': '2px solid #E0E0E0' }
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '2px solid #E0E0E0' }
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                cellStyle: { 'border-right': '2px solid #E0E0E0' }
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port'
            }
        ]
    }

    // ================================================================================
    // * Forms Builder
    // ================================================================================
    uploadRatecardFormBuilder() {
        this.buildRatecardFormGroup()
        this.buildPercentFormGroup()
        this.buildUploadRatesFormGroup()
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

    buildUploadRatesFormGroup = (): FormGroup => this.uploadRatesFormGroup = this._formBuilder.group({uploadRatesCtrl: ['']})
    

    // ================================================================================
    // * Input data
    // ================================================================================
    getMarkupTeleuAsPercent() {
        const teleuPercentValue = ((this.percentFormGroup.get('teleUPercentCtrl').value * 100) - 100).toFixed(4)
        return (this.percentFormGroup.get('teleUPercentCtrl').value > 0 ) 
                ? teleuPercentValue 
                : 0
    }

    getMarkupPrivateAsPercent(): any {
        const privatePercentValue = this.percentFormGroup.get('privatePercentCtrl').value
        const teleuPerentValue = this.percentFormGroup.get('teleUPercentCtrl').value
        return ( teleuPerentValue > 0 ) 
                ? ((privatePercentValue * 100) - 100).toFixed(4) 
                : 0
    }

    // ================================================================================
    // * UI Interaction
    // ================================================================================
    rowSelected(): void { // Toggle button boolean if rowSelected > 0
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length
    }

    toggleButtonStates(): boolean {
        return this._toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus)
    }

    checkBoxValueTeleU(): boolean {
        return !this.percentFormGroup.get('teleUCheckboxCtrl').value
    }

    checkBoxValuePrivate(): boolean {
        return !this.percentFormGroup.get('privateCheckboxCtrl').value
    }

    uploadValidator(): boolean { // pass into step 2's [disable] to control button disable
        return (this.disableUploadBoolean) ? true : false
    }

    // ================================================================================
    // * Construct JSON
    // ================================================================================
    formPostBody() {
        this.postBody = {
            name: this.ratecardFormGroup.get('ratecardCtrl').value + ' - ' + this.ratecardFormGroup.get('ratecardTierCtrl').value,
            carrier_id: this.ratecardFormGroup.get('carrierCtrl').value,
            addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
            teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
            asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
            privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
            tier: this.ratecardFormGroup.get('ratecardTierCtrl').value,
            rates: this.ratesList
        }
    }
    // ================================================================================
    // * Dialog
    // ================================================================================
    closeDialog(): void {
        this._dialogRef.close()
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
            const csvFile = e.target.files[0]
            this.fileName = csvFile.name
            this.papaParse(csvFile)
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
    
    profileSorter(data: Array<any>): void { // Based on the Carrier Name match the String to trigger the right profile
        new Promise( (resolve, reject) => {
            resolve(this.defaultProfile(data))
        })
        .then( () => {
            this.numberOfRates = this.ratesList.length
            this._importerSharedService.changeNumberOfRatesInRatecard(this.numberOfRates)
        })
        .then( () => {
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
                start_ts: (DateUtils.dateStringToEpoch(eaRate[3])).toString(),
                end_ts: (DateUtils.dateStringToEpoch(eaRate[3]) + 31557600).toString() // add one year as end_ts
            }
        })
        this.ratesList = rateList
        return dataNoHeaders
    }
}
