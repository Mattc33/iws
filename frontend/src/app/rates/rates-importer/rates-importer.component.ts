import { Component, OnInit, ViewChild, Directive } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatStepper, MatRadioButton } from '@angular/material';

import { FileUploaderComponent } from './file-uploader/file-uploader.component';


@Component({
  selector: 'app-rates-importer',
  templateUrl: './rates-importer.component.html',
  styleUrls: ['./rates-importer.component.scss'],
})

export class RatesimporterComponent implements OnInit {

  // To access child component methods and data, to call use .f
  @ViewChild(FileUploaderComponent) fileUploaderComponent;

  // Form Group var
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // Values being passed into service
  completedRates = [];
  carrierName: string;
  levelName: string;

  carrierNames = [
    {value: 'PowerNet Global', viewValue: 'PowerNet Global'},
    {value: 'VoxBeam', viewValue: 'VoxBeam'},
  ];

  levelNames = [
    {value: 'No Tier', viewValue: 'No Level'},
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

  // Get Form Values, feeds into getInputValues method
  getCarrierName() {
    this.carrierName = this.getInputValues('firstCtrl');
  }

  getTierName() {
    this.levelName = this.getInputValues('secondCtrl');
  }

  // assigns the value of the input to carrierNameValue; return
  getInputValues(controllerName) {
    if (controllerName === 'firstCtrl') {
      const carrierNameValue = this.firstFormGroup.get(controllerName).value;
      console.log(carrierNameValue);
      return carrierNameValue;
    }

    if (controllerName === 'secondCtrl') {
      const levelNameValue = this.secondFormGroup.get(controllerName).value;
      console.log(levelNameValue);
      return levelNameValue;
    }
  }
}
