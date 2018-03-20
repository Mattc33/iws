import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { TrunksTableComponent } from './../../trunks-table.component';

import { TrunksService } from './../../../services/trunks.api.service';
import { TrunksSharedService } from './../../../services/trunks.shared.service';
import { CarrierService } from './../../../../carrier/services/carrier.api.service';

/* Error when invalid control is dirty, touched, or submitted. */
export class CarrierErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
  selector: 'app-add-trunks',
  templateUrl: './add-trunks.component.html',
  styleUrls: ['./add-trunks.component.scss']
})
export class AddTrunksComponent implements OnInit {

    event_onAdd = new EventEmitter;

    // Form Group var
    private carrierFormGroup: FormGroup;
    private trunksFormGroup: FormGroup;

    // Var
    private carrierNames = [];
    private currentCarrierId: number;
    private transportMethods = [
        {value: 'udp'}, {value: 'tcp'}, {value: 'both'}
    ];
    private activeValues = [
        {value: true}, {value: false}
    ];
    private directionValues = [
        {value: 'inbound'}, {value: 'outbound'}
    ];
    private carrierName: string;
    private finalTrunkObj;


    // Validation Patterns

    constructor(
        public dialogRef: MatDialogRef <TrunksTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private trunksService: TrunksService,
        private trunksSharedService: TrunksSharedService,
        private carrierService: CarrierService
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
                resp => { console.log(resp); }
            );
    }

    /*
        ~~~~~~~~~~ Extract Necessary Data ~~~~~~~~~~
    */
    extractCarrierNames(data): void {
        for ( let i = 0; i < data.length ; i++) {
            this.carrierNames.push( { value: data[i].name, id: data[i].id }, );
        }
    }

    on_getCarrierId(): number {
        const carrierNameFromInput = this.on_getCarrierName();
        const carrierNameFromArr = this.carrierNames;
        let carrierId: number;

        for (let i = 0; i < this.carrierNames.length; i++) {
            if ( carrierNameFromInput === carrierNameFromArr[i].value) {
                carrierId = this.carrierNames[i].id;
            } else {
            }
        }
        this.currentCarrierId = carrierId;
        return carrierId;
    }


    /*
        ~~~~~~~~~~ Get Input Values ~~~~~~~~~~
    */
    on_getCarrierName(): string {
        const carrierName = this.carrierFormGroup.get('carrierCtrl').value;
            this.carrierName = carrierName;
            return carrierName;
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
            carrier_id: this.on_getCarrierId(),
            carrier_name: this.carrierName,
            trunk_name: this.trunksFormGroup.get('nameCtrl').value + ' ' + randomNum,
            trunk_ip: this.trunksFormGroup.get('ipCtrl').value,
            trunk_port: parseInt(this.trunksFormGroup.get('portCtrl').value),
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
        this.trunksFormGroup.get('prefixCtrl').setValue('prefix');
        this.trunksFormGroup.get('activeCtrl').setValue(true);
        this.trunksFormGroup.get('metadataCtrl').setValue('meta data');
    }
}
