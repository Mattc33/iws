import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RateCardsTableComponent } from './../../rate-cards-table.component';

import { RateCardsService } from '../../../services/rate-cards.api.service';
import { RateCardsSharedService } from '../../../services/rate-cards.shared.service';

@Component({
  selector: 'app-upload-rates',
  templateUrl: './upload-rates-dialog.component.html',
  styleUrls: ['./upload-rates-dialog.component.scss']
})
export class UploadRatesDialogComponent implements OnInit {

    // Form Group var
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    // Var
    carrierInfo = [];
    carrierNames = [];
    rateCardInfo = [];
    rateCardNames = [];

    constructor(public dialogRef: MatDialogRef <RateCardsTableComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, private rateCardsService: RateCardsService) {}

    ngOnInit() {
        this.firstFormGroup = this.formBuilder.group({
        firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this.formBuilder.group({
        secondCtrl: [''],
        name: ['', Validators.required],
        });

        this.get_carrierName();
    }

    get_carrierName() {
        // subscribe to service and get carrier names
        this.rateCardsService.get_RateCard()
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
            this.carrierNames.push( { carrier_name: data[i].carrier_name, rate_card_name: data[i].name, id: data[i].id }, );
        }
    }

  // loop through json object and push obj into Arr {value: name, viewValue: name}
  extractRateCardNames(data): void {
      for ( let i = 0; i < data.length; i++) {
          this.rateCardInfo.push( { value: data[i].name, id: data[i].id }, );
      }
  }

  // Match selected carrier and display relevent rate cards(their names) in drop down based on
  // an a loop that checks for matching carrier_id's
  // matchCorrectRateCardOfCarrier() {
  //     const currentCarrierId = this.getCarrierId();
  //     // loop through all availible rate cards
  //     for ( let i = 0; i < this.rateCardInfo.length; i++) {
  //         if (this.getCarrierId === this.rateCardInfo[i].carrier_id) {
  //             // push updated rate card objects into rateCardNames Arr, from only the selected carrier
  //             this.rateCardNames.push( { value: this.rateCardInfo[i].value, id: this.rateCardInfo[i].id } );
  //         } else {
  //         }
  //     }
  // }

  csvToJson() {

  }

}
