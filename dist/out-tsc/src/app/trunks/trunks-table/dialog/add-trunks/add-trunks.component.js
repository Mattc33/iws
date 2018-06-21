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
var trunks_api_service_1 = require("./../../../services/trunks.api.service");
var trunks_shared_service_1 = require("./../../../services/trunks.shared.service");
var carrier_api_service_1 = require("./../../../../shared/api-services/carrier/carrier.api.service");
var snackbar_shared_service_1 = require("./../../../../shared/services/global/snackbar.shared.service");
var AddTrunksComponent = /** @class */ (function () {
    function AddTrunksComponent(dialogRef, data, formBuilder, trunksService, trunksSharedService, carrierService, snackbarSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.trunksService = trunksService;
        this.trunksSharedService = trunksSharedService;
        this.carrierService = carrierService;
        this.snackbarSharedService = snackbarSharedService;
        // Events
        this.event_onAdd = new core_1.EventEmitter;
        // Input variables
        this.carrierNames = [];
        this.transportMethods = [{ value: 'udp' }, { value: 'tcp' }, { value: 'both' }];
        this.activeValues = [{ value: true }, { value: false }];
        this.directionValues = [{ value: 'inbound' }, { value: 'outbound' }];
    }
    AddTrunksComponent.prototype.ngOnInit = function () {
        this.get_getCarrierData();
        this.carrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['', forms_1.Validators.required]
        });
        this.trunksFormGroup = this.formBuilder.group({
            nameCtrl: ['', forms_1.Validators.required],
            ipCtrl: ['', forms_1.Validators.required],
            portCtrl: ['', forms_1.Validators.required],
            transportCtrl: ['', forms_1.Validators.required],
            directionCtrl: ['', forms_1.Validators.required],
            prefixCtrl: ['', forms_1.Validators.required],
            activeCtrl: ['', forms_1.Validators.required],
            metadataCtrl: ['', forms_1.Validators.required]
        });
        // , Validators.pattern('^[0-9]+$')
    };
    /*
        ~~~~~~~~~~ API Service ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.get_getCarrierData = function () {
        var _this = this;
        this.carrierService.get_carriers()
            .subscribe(function (data) { _this.extractCarrierNames(data); }, function (error) { console.log(error); });
    };
    AddTrunksComponent.prototype.post_addTrunk = function (body) {
        var _this = this;
        this.trunksService.post_addTrunk(body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Trunk added succesfully.', 5000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Trunk failed to add.', 5000);
        });
    };
    /*
        ~~~~~~~~~~ Extract Necessary Data ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.filterMatchDataToAnyObjField = function (nameInput, arrayOfObj, field) {
        return arrayOfObj.filter(function (data) { return data.name === nameInput; });
    };
    AddTrunksComponent.prototype.returnCarrierId = function () {
        return this.filterMatchDataToAnyObjField(this.carrierFormGroup.get('carrierCtrl').value, this.carrierNames, name)[0].id;
    };
    AddTrunksComponent.prototype.extractCarrierNames = function (data) {
        for (var i = 0; i < data.length; i++) {
            this.carrierNames.push({ name: data[i].name, id: data[i].id });
        }
    };
    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.aggrid_addTrunks = function (body) {
        this.event_onAdd.emit(body);
    };
    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.createTrunkObj = function () {
        var randomNum = Math.floor(Math.random() * 9999);
        this.finalTrunkObj = {
            carrier_id: this.returnCarrierId(),
            carrier_name: this.carrierName,
            trunk_name: this.trunksFormGroup.get('nameCtrl').value + ' ' + randomNum,
            trunk_ip: this.trunksFormGroup.get('ipCtrl').value,
            trunk_port: parseInt(this.trunksFormGroup.get('portCtrl').value, 0),
            transport: this.trunksFormGroup.get('transportCtrl').value,
            direction: this.trunksFormGroup.get('directionCtrl').value,
            prefix: this.trunksFormGroup.get('prefixCtrl').value,
            active: this.trunksFormGroup.get('activeCtrl').value,
            metadata: this.trunksFormGroup.get('metadataCtrl').value
        };
    };
    AddTrunksComponent.prototype.click_addTrunks = function () {
        this.createTrunkObj();
        this.aggrid_addTrunks(this.finalTrunkObj);
        this.post_addTrunk(this.finalTrunkObj);
        this.closeDialog();
    };
    AddTrunksComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    /*
        ~~~~~~~~~~ TEST ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.insertTrunkTestData = function () {
        var randomNumber = Math.floor(Math.random() * Math.floor(9999));
        this.trunksFormGroup.get('nameCtrl').setValue('Test Trunk ' + randomNumber);
        this.trunksFormGroup.get('ipCtrl').setValue('192.168.1.1');
        this.trunksFormGroup.get('portCtrl').setValue('3308');
        this.trunksFormGroup.get('transportCtrl').setValue('udp');
        this.trunksFormGroup.get('directionCtrl').setValue('outbound');
        this.trunksFormGroup.get('prefixCtrl').setValue('1234');
        this.trunksFormGroup.get('activeCtrl').setValue(true);
        this.trunksFormGroup.get('metadataCtrl').setValue('meta data');
    };
    AddTrunksComponent = __decorate([
        core_1.Component({
            selector: 'app-add-trunks',
            templateUrl: './add-trunks.component.html',
            styleUrls: ['./add-trunks.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, forms_1.FormBuilder,
            trunks_api_service_1.TrunksService,
            trunks_shared_service_1.TrunksSharedService,
            carrier_api_service_1.CarrierService,
            snackbar_shared_service_1.SnackbarSharedService])
    ], AddTrunksComponent);
    return AddTrunksComponent;
}());
exports.AddTrunksComponent = AddTrunksComponent;
//# sourceMappingURL=add-trunks.component.js.map