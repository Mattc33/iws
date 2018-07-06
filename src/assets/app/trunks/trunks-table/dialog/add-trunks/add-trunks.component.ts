
import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { TrunksTableComponent } from './../../trunks-table.component';

import { TrunksService } from './../../../../shared/api-services/trunk/trunks.api.service';
import { TrunksSharedService } from './../../../../shared/services/trunk/trunks.shared.service';
import { CarrierService } from './../../../../shared/api-services/carrier/carrier.api.service';
import { SnackbarSharedService } from './../../../../shared/services/global/snackbar.shared.service';

@Component({
  selector: 'app-add-trunks',
  templateUrl: './add-trunks.component.html',
  styleUrls: ['./add-trunks.component.scss']
})
export class AddTrunksComponent implements OnInit {

    // Events
    event_onAdd = new EventEmitter;

    // Form Group var
    carrierFormGroup: FormGroup;
    trunksFormGroup: FormGroup;

    // Input variables
    carrierNames = [];

    //
    currentCarrierId: number;
    transportMethods = [ {value: 'udp'}, {value: 'tcp'}, {value: 'both'} ];
    activeValues = [ {value: true}, {value: false} ];
    directionValues = [ {value: 'inbound'}, {value: 'outbound'} ];
    carrierName: string;
    finalTrunkObj;

    constructor(
        public dialogRef: MatDialogRef <TrunksTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private trunksService: TrunksService,
        private trunksSharedService: TrunksSharedService,
        private carrierService: CarrierService,
        private snackbarSharedService: SnackbarSharedService
    ) { }

    ngOnInit() {
        this.get_getCarrierData();

        this.carrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['', Validators.required]
        });
        this.trunksFormGroup = this.formBuilder.group({
            nameCtrl: ['', Validators.required],
            ipCtrl: ['', Validators.required],
            portCtrl: ['', Validators.required],
            transportCtrl: ['', Validators.required],
            directionCtrl: ['', Validators.required],
            prefixCtrl: ['', Validators.required],
            activeCtrl: ['', Validators.required],
            metadataCtrl: ['', Validators.required]
        });
    }

    /*
        ~~~~~~~~~~ API Service ~~~~~~~~~~
    */
    get_getCarrierData(): void {
        this.carrierService.get_carriers()
            .subscribe(
                data => { this.extractCarrierNames(data); },
                error => { console.log(error); },
            );
    }

    post_addTrunk(body): void {
        this.trunksService.post_addTrunk(body)
            .subscribe(
                (resp: Response) => {
                    console.log(resp);
                    if ( resp.status === 200 ) {
                        this.snackbarSharedService.snackbar_success('Trunk added succesfully.', 5000);
                    }
                },
                error => {
                    console.log(error);
                    this.snackbarSharedService.snackbar_error('Trunk failed to add.', 5000);
                }
            );
    }

    /*
        ~~~~~~~~~~ Extract Necessary Data ~~~~~~~~~~
    */
    filterMatchDataToAnyObjField(nameInput: any, arrayOfObj: any, field: any ): any {
        return arrayOfObj.filter(data => data.name === nameInput);
    }

    returnCarrierId(): number {
        return this.filterMatchDataToAnyObjField(this.carrierFormGroup.get('carrierCtrl').value, this.carrierNames, name)[0].id;
    }

    extractCarrierNames(data): void {
        for ( let i = 0; i < data.length ; i++) {
            this.carrierNames.push( {name: data[i].name, id: data[i].id} );
        }
    }

    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~
    */
    aggrid_addTrunks(body): void {
        this.event_onAdd.emit(body);
    }

    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    createTrunkObj() {
        const randomNum = Math.floor(Math.random() * 9999);
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
    }

    click_addTrunks(): void {
        this.createTrunkObj();
        this.aggrid_addTrunks(this.finalTrunkObj);
        this.post_addTrunk(this.finalTrunkObj);

        this.closeDialog();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    /*
        ~~~~~~~~~~ TEST ~~~~~~~~~~
    */
    insertTrunkTestData() {
        const randomNumber = Math.floor(Math.random() * Math.floor(9999));
        this.trunksFormGroup.get('nameCtrl').setValue('Test Trunk ' + randomNumber);
        this.trunksFormGroup.get('ipCtrl').setValue('192.168.1.1');
        this.trunksFormGroup.get('portCtrl').setValue('3308');
        this.trunksFormGroup.get('transportCtrl').setValue('udp');
        this.trunksFormGroup.get('directionCtrl').setValue('outbound');
        this.trunksFormGroup.get('prefixCtrl').setValue('1234');
        this.trunksFormGroup.get('activeCtrl').setValue(true);
        this.trunksFormGroup.get('metadataCtrl').setValue('meta data');
    }
}
