import { Component, Inject, OnInit, AnimationKeyframe, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RateCardsUiComponent } from '../../rate-cards-ui/rate-cards-ui.component';
import { RateCardsService } from '../../services/rate-cards.service';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';

@Component({
    selector: 'app-upload-rates-dialog-inner',
    templateUrl: './upload-rates-dialog.component.html',
    styleUrls: [],
    providers: [ RateCardsService ],
  })
export class UploadRatesDialogComponent implements OnInit {

    // Form Group var
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    // Var
    carrierInfo = [];
    rateCardInfo = [];
    rateCardNames = [];

    constructor(public dialogRef: MatDialogRef <RateCardsUiComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, private rateCardsService: RateCardsService) {}

    ngOnInit() {
      this.firstFormGroup = this.formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this.formBuilder.group({
        secondCtrl: [''],
        name: ['', Validators.required],
      });
    }

    getCarrierInfo() {
        this.rateCardsService.get_RateCard()
            .subscribe(
                data => {
                    console.log(data);
                    this.extractCarrierNames(data);
                    this.extractRateCardNames(data);
                },
                error => { console.log(error); },
            );
    }

    // loop through json object and push obj into Arr {value: name, viewValue: name}
    extractCarrierNames(data): void {
        for ( let i = 0; i < data.length; i++) {
            this.carrierInfo.push( { value: data[i].carrier_name, id: data[i].carrer_id }, );
        }
    }

    // loop through json object and push obj into Arr {value: name, viewValue: name}
    extractRateCardNames(data): void {
        for ( let i = 0; i < data.length; i++) {
            this.rateCardInfo.push( { value: data[i].name, id: data[i].id }, );
        }
    }

    getCarrierName(): string {
        const carrierName = this.firstFormGroup.get('firstCtrl').value;
        return carrierName;
    }

    getCarrierId(): number {
        const carrierNameFromInput = this.getCarrierName();
        const carrierNameFromArr = this.carrierInfo;
        let currentCarrierId: number;

        for (let i = 0; i < this.carrierInfo.length; i++) {
            if ( carrierNameFromInput === carrierNameFromArr[i].value) {
                currentCarrierId = this.carrierInfo[i].id;
            } else {
            }
        }
        return currentCarrierId;
    }

    // Match selected carrier and display relevent rate cards(their names) in drop down based on
    // an a loop that checks for matching carrier_id's
    matchCorrectRateCardOfCarrier() {
        const currentCarrierId = this.getCarrierId();
        // loop through all availible rate cards
        for ( let i = 0; i < this.rateCardInfo.length; i++) {
            if (this.getCarrierId === this.rateCardInfo[i].carrier_id) {
                // push updated rate card objects into rateCardNames Arr, from only the selected carrier
                this.rateCardNames.push( { value: this.rateCardInfo[i].value, id: this.rateCardInfo[i].id } );
            } else {
            }
        }
    }

    

    csvToJson() {

    }


}
