import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RateCardsTableComponent } from './../../rate-cards-table.component';

import { RateCardsService } from '../../../services/rate-cards.api.service';


@Component({
    selector: 'app-upload-rates-dialog',
    templateUrl: './add-rate-cards-dialog.component.html',
    styleUrls: ['./add-rate-cards-dialog.component.scss'],
    providers: [ RateCardsService ],
  })
export class AddRateCardDialogComponent implements OnInit {

    event_onAdd = new EventEmitter();

    // Form Group var
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    // var
    carrierNames = [];
    rateCardName: string;

    currentRateCardName: string;
    currentCarrierId: number;

    constructor(public dialogRef: MatDialogRef <RateCardsTableComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, private rateCardsService: RateCardsService
    ) {}

    ngOnInit() {
      this.firstFormGroup = this.formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this.formBuilder.group({
        secondCtrl: [''],
        name: ['', Validators.required],
      });

      // subscribe to service and get carrier names
      this.rateCardsService.get_CarrierNames()
        .subscribe(
            data => {
                console.log(data);
                this.extractCarrierNames(data); // pass data as arg into private func
            },
            error => { console.log(error); },
        );
    }

    // loop through json object and push obj into Arr {value: name, viewValue: name}
    extractCarrierNames(data): void {
        for ( let i = 0; i < data.length ; i++) {
            this.carrierNames.push( { value: data[i].name, id: data[i].id }, );
        }
    }

    // pass in carrierName to defaultRateCardName()
    // returns carrierName as String
    on_getCarrierName(): string {
        const carrierName = this.firstFormGroup.get('firstCtrl').value;
        // pass in carrierName to defaultRateCardName String
        return carrierName;
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

    on_getRateCardName(): string {
        const rateCardName = this.secondFormGroup.get('name').value;
        this.currentRateCardName = rateCardName;
        return rateCardName;
    }

    // provideDefaultRateCardName(carrierName) {
    //     let defaultRateCardName: any;
    //     let date = new Date();
    //     const customDate = ` ${date.getDay()}_${date.getMonth() + 1}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    //     defaultRateCardName = carrierName + customDate;
    //     // Sets default value of control 'name'
    //     this.secondFormGroup.get('name').patchValue(defaultRateCardName);
    //     // this.secondFormGroup.get('name').setValue(defaultRateCardName);
    // }

    // assigns the value of the input to carrierNameValue; return
    getInputValues(controllerName) {
      if (controllerName === 'firstCtrl') {
        const carrierNameValue = this.firstFormGroup.get(controllerName).value;
        return carrierNameValue;
      }
    }

    // service call to post ratecard to server
    click_addRateCard() {
        this.post_addRateCard();
        this.aggrid_addRateCard();
        this.closeDialog();
    }

    // close dialog
    closeDialog(): void {
        this.dialogRef.close();
    }

    // subscribe to service and pass addrow data to API
    post_addRateCard() {
        const body = {
            name: this.currentRateCardName,
            carrier_id: this.currentCarrierId,
        };

        // Pass new rateCardObj as body to API
        this.rateCardsService.post_AddRateCard(body)
        .subscribe(res => console.log(res));
    }

    // emit event to parent Table Component containing row object
    aggrid_addRateCard() {
        const body = {
            name: this.currentRateCardName,
            carrier_name: this.on_getCarrierName(),
            start_ts: 'server start time',
            end_ts: 'server end time',
            add_ts: 'server add time'
        };
        this.event_onAdd.emit(body);
    }
}
