import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatStepper, MatRadioButton } from '@angular/material';

@Component({
  selector: 'app-ratesimporter',
  templateUrl: './ratesimporter.component.html',
  styleUrls: ['./ratesimporter.component.scss']
})

export class RatesimporterComponent implements OnInit {

  // Form Group var
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // Values being passed into service
  completedRates = [];
  carrierName: string;
  tierName: string;

  carrierNames = [
    {value: 'PowerNet Global', viewValue: 'PowerNet Global'},
    {value: 'VoxBeam', viewValue: 'VoxBeam'},
  ];

  tierNames = [
    {value: 'No Tier', viewValue: 'No Tier'},
    {value: 'Silver', viewValue: 'Silver'},
    {value: 'Gold', viewValue: 'Gold'},
    {value: 'Platinum', viewValue: 'Platinum'},
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  // Get Form Values
  getCarrierName() {
    this.carrierName = this.getInputValues('firstCtrl');
  }

  getTierName() {
    this.tierName = this.getInputValues('secondCtrl');
  }

  getInputValues(controllerName) {
    if(controllerName === 'firstCtrl') {
      let carrierNameValue = this.firstFormGroup.get(controllerName).value;
      console.log(carrierNameValue);
      return carrierNameValue;
    }

    if(controllerName === 'secondCtrl') {
      let tierNameValue = this.secondFormGroup.get(controllerName).value;
      console.log(tierNameValue);
      return tierNameValue;
    }
  }
}
