"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var ngx_papaparse_1 = require("ngx-papaparse");
var importer_api_service_1 = require("./../../../services/importer.api.service");
var importer_shared_service_1 = require("./../../../services/importer.shared.service");
var trunks_api_service_1 = require("./../../../../../trunks/services/trunks.api.service");
var snackbar_shared_service_1 = require("./../../../../../shared/services/global/snackbar.shared.service");
var buttonStates_shared_service_1 = require("./../../../../../shared/services/global/buttonStates.shared.service");
var UploadRatesDialogComponent = /** @class */ (function () {
    function UploadRatesDialogComponent(dialogRef, data, papa, formBuilder, importerService, importerSharedService, trunksService, snackbarSharedService, toggleButtonStateService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.papa = papa;
        this.formBuilder = formBuilder;
        this.importerService = importerService;
        this.importerSharedService = importerSharedService;
        this.trunksService = trunksService;
        this.snackbarSharedService = snackbarSharedService;
        this.toggleButtonStateService = toggleButtonStateService;
        // event
        this.event_passTrunkId = new core_1.EventEmitter;
        // DB Objects
        this.carrierObj = [];
        this.currentRateCardNames = []; // rate cards obj populated by method  currentRateCardList()
        // Input props
        this.percents = [
            { value: 1, viewValue: 'No Markup' },
            { value: 1.05, viewValue: '5%' }, { value: 1.1, viewValue: '10%' }, { value: 1.15, viewValue: '15%' }, { value: 1.2, viewValue: '20%' },
            { value: 1.25, viewValue: '25%' }, { value: 1.3, viewValue: '30%' }, { value: 1.35, viewValue: '35%' }, { value: 1.4, viewValue: '40%' },
            { value: 1.45, viewValue: '45%' }, { value: 1.5, viewValue: '50%' }, { value: 1.55, viewValue: '55%' }, { value: 1.6, viewValue: '60%' },
            { value: 1.65, viewValue: '65%' }, { value: 1.7, viewValue: '70%' }, { value: 1.75, viewValue: '75%' }, { value: 1.8, viewValue: '80%' },
            { value: 1.85, viewValue: '85%' }, { value: 1.9, viewValue: '90%' }, { value: 1.95, viewValue: '95%' }, { value: 2, viewValue: '100%' }
        ];
        this.disableUploadBoolean = true;
        this.finalRatecardPreviewObj = [];
        this.ratesPreviewObj = [];
        this.totalRatesProcessed = 0;
    }
    UploadRatesDialogComponent.prototype.ngOnInit = function () {
        this.get_carrier();
        this.get_trunks();
        this.columnDefs = this.createColumnDefs();
        this.carrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['', forms_1.Validators.required]
        });
        this.ratecardFormGroup = this.formBuilder.group({
            ratecardCtrl: ['', forms_1.Validators.required],
        });
        this.percentFormGroup = this.formBuilder.group({
            teleUCheckboxCtrl: [false],
            teleUPercentCtrl: [0],
            privateCheckboxCtrl: [true],
            privatePercentCtrl: [1.05]
        });
        this.uploadRatesFormGroup = this.formBuilder.group({
            uploadRatesCtrl: ['', forms_1.Validators.required]
        });
        this.percentFormGroup.controls.teleUCheckboxCtrl.setValue(false);
        this.percentFormGroup.controls.privateCheckboxCtrl.setValue(true);
    };
    /*
        ~~~~~~~~~~ API service ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.get_carrier = function () {
        var _this = this;
        this.importerService.get_CarrierNames()
            .subscribe(function (data) { _this.carrierObj = data; }, function (error) { console.log(error); });
    };
    UploadRatesDialogComponent.prototype.get_trunks = function () {
        var _this = this;
        this.trunksService.get_allTrunks()
            .subscribe(function (data) { _this.rowData = data; }, function (error) { console.log(error); });
    };
    UploadRatesDialogComponent.prototype.post_addRates = function () {
        var _this = this;
        this.importerService.post_AddRateCard(this.finalRatecardObj)
            .subscribe(function (resp) {
            for (var i = 0; i < resp.length; i++) {
                _this.totalRatesProcessed += resp[i].rates.length;
            }
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Ratecards successful imported.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Ratecards failed to import.', 2000);
        });
    };
    /*
        ~~~~~~~~~~ Grid Initiation ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    UploadRatesDialogComponent.prototype.createColumnDefs = function () {
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
    };
    /*
        ~~~~~~~~~~ Extract data ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.extract_CarrierName = function () {
        for (var i = 0; i < this.carrierObj.length; i++) {
            if (this.carrierObj[i].id === this.input_getCarrierId()) {
                return this.carrierObj[i].name;
            }
        }
    };
    /*
        ~~~~~~~~~~ Get data from input ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.input_getCarrierId = function () {
        return this.carrierFormGroup.get('carrierCtrl').value;
    };
    UploadRatesDialogComponent.prototype.input_getRateCardName = function () {
        return this.ratecardFormGroup.get('ratecardCtrl').value;
    };
    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
    // For button Toggle
    UploadRatesDialogComponent.prototype.rowSelected = function () {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    UploadRatesDialogComponent.prototype.toggleButtonStates = function () {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    };
    UploadRatesDialogComponent.prototype.checkBoxValueTeleU = function () {
        return !this.percentFormGroup.get('teleUCheckboxCtrl').value;
    };
    UploadRatesDialogComponent.prototype.checkBoxValuePrivate = function () {
        return !this.percentFormGroup.get('privateCheckboxCtrl').value;
    };
    UploadRatesDialogComponent.prototype.changeListenerUploadBtn = function (event) {
        if (event.target.files && event.target.files[0]) {
            var csvFile = event.target.files[0];
            this.fileName = csvFile.name;
            this.papaParse(csvFile);
            this.disableUploadBoolean = false; // pass boolean flag for valdation
        }
        else {
            this.disableUploadBoolean = true;
        }
    };
    UploadRatesDialogComponent.prototype.uploadValidator = function (boolean) {
        if (this.disableUploadBoolean === true) {
            return true;
        }
        if (this.disableUploadBoolean === false) {
            return false;
        }
    };
    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.aggrid_addRatecard = function () {
        var _this = this;
        this.importerSharedService.currentPostTableObj.subscribe(function (data) { _this.postTableArr = data; });
        this.event_passTrunkId.emit(this.gridApi.getSelectedRows[0]);
    };
    /*
        ~~~~~~~~~~~ Construct JSON ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.construct_ratecardObj = function () {
        this.finalRatecardObj = {
            name: this.ratecardFormGroup.get('ratecardCtrl').value,
            carrier_id: this.input_getCarrierId(),
            addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
            teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
            asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
            privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
            rates: []
        };
        this.finalRatecardPreviewObj.push({
            name: this.ratecardFormGroup.get('ratecardCtrl').value,
            carrier_id: this.input_getCarrierId(),
            addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
            teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
            asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
            privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
        });
        console.log(this.finalRatecardObj);
    };
    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    UploadRatesDialogComponent.prototype.passTrunkId = function () {
        this.event_passTrunkId.emit(this.gridApi.getSelectedRows()[0].id);
    };
    UploadRatesDialogComponent.prototype.click_addRates = function () {
        this.passTrunkId();
        this.closeDialog();
    };
    /*
        ~~~~~~~~~~ CSV Parser ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.papaParse = function (csvFile) {
        var _this = this;
        this.papa.parse(csvFile, {
            complete: function (results) {
                console.log('Parsed: ', results);
                var data = results.data;
                _this.profileSorter(data);
            }
        });
    };
    UploadRatesDialogComponent.prototype.profileSorter = function (data) {
        var currentCarrierName = this.extract_CarrierName();
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
        if (currentCarrierName.toLowerCase() === 'pccw global') {
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
    };
    UploadRatesDialogComponent.prototype.generateRateObj = function (destination, prefix, buyrate, sellrate) {
        var destinationRemoveBadChar = destination.replace(/\\|'|\\'/, '');
        if (destinationRemoveBadChar.length > 64) {
            destinationRemoveBadChar = destinationRemoveBadChar.substring(0, 64);
        }
        this.finalRatecardObj.rates.push({ destination: destinationRemoveBadChar,
            prefix: prefix,
            buy_rate: buyrate,
            buy_rate_minimum: 1,
            buy_rate_increment: 1,
            sell_rate: sellrate,
            sell_rate_minimum: 60,
            sell_rate_increment: 60
        });
        this.ratesPreviewObj.push({ destination: destinationRemoveBadChar,
            prefix: prefix,
            buy_rate: buyrate,
            buy_rate_minimum: 1,
            buy_rate_increment: 1,
            sell_rate: sellrate,
            sell_rate_minimum: 60,
            sell_rate_increment: 60
        });
    };
    UploadRatesDialogComponent.prototype.defaultProfile = function (data) {
        var dataSliced = data.slice(1, -1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.powerNetGlobalProfile = function (data) {
        var dataSliced = data.slice(3);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            var buyrate = dataSliced[i][2].slice(1) * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.voxBeamProfile = function (data) {
        var dataSliced = data.slice(1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][2];
            var prefix = dataSliced[i][0];
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.alcazarNetworksProfile = function (data) {
        var dataSliced = data.slice(7);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === "'") {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.bankaiGroupProfile = function (data) {
        var dataSliced = data.slice(1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.pccwGlobalProfile = function (data) {
        var dataSliced = data.slice(13);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][4] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.starsippProfile = function (data) {
        var dataSliced = data.slice(1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][2];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.teleinxProfile = function (data) {
        var dataSliced = data.slice(1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][2];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.voiPlatinumProfile = function (data) {
        var dataSliced = data.slice(1, -1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.voipRoutesProfile = function (data) {
        var dataSliced = data.slice(9);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][0];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.megatelProfile = function (data) {
        var dataSliced = data.slice(2);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][2];
            var buyrate = dataSliced[i][4] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.teliaCarrierProfile = function (data) {
        var dataSliced = data.slice(18);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][2];
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.allWorldCommunications = function (data) {
        var dataSliced = data.slice(9, -1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][3];
            var prefix = dataSliced[i][2];
            var buyrate = dataSliced[i][4] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.kftelProfile = function (data) {
        var dataSliced = data.slice(1, -9);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.pstProfile = function (data) {
        var dataSliced = data.slice(5, -4);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][0];
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-upload-rates',
            templateUrl: './upload-rates-dialog.component.html',
            styleUrls: ['./upload-rates-dialog.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, ngx_papaparse_1.PapaParseService,
            forms_1.FormBuilder,
            importer_api_service_1.ImporterService,
            importer_shared_service_1.ImporterSharedService,
            trunks_api_service_1.TrunksService,
            snackbar_shared_service_1.SnackbarSharedService,
            buttonStates_shared_service_1.ToggleButtonStateService])
    ], UploadRatesDialogComponent);
    return UploadRatesDialogComponent;
}());
exports.UploadRatesDialogComponent = UploadRatesDialogComponent;
//# sourceMappingURL=upload-rates-dialog.component.js.map