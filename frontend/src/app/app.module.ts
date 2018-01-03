// Core Modules
// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';
import { FileSelectDirective } from 'ng2-file-upload';

// UI Library: Angular Materials
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatStepperModule, MatSelectModule } from '@angular/material';
import { MatCheckboxModule, MatIconModule, MatRadioModule, MatDialogModule } from '@angular/material';

/* --------------------------------------------------------------------------------------------------------------------------------------
   -------------------------------------------------------------------------------------------------------------------------------------- */

// Main components
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';

// DashBoard
import { DashboardComponent } from './dashboard/dashboard.component';

// Carrier using AG - Grid
import { AgGridModule } from 'ag-grid-angular';
import { CarrierComponent } from './carrier/carrier.component';
import { CarrierTableComponent } from './carrier/carrier-table/carrier-table.component';
import { CarrierUiComponent } from './carrier/carrier-ui/carrier-ui.component';

import { AddCarrierDialogComponent } from './carrier/dialog/add-carrier/add-carrier-dialog.component';
import { DelCarrierDialogComponent } from './carrier/dialog/del-carrier/del-carrier-dialog.component';

import { CarrierService } from './carrier/services/carrier.service';
import { TableService } from './carrier/services/table.service';

// Rate Cards
import { RateCardsComponent } from './rate-cards/rate-cards.component';
import { RateCardsUiComponent } from './rate-cards/rate-cards-ui/rate-cards-ui.component';
import { RateCardsTableComponent } from './rate-cards/rate-cards-table/rate-cards-table.component';
import { FileUploaderComponent } from './rate-cards/dialog/upload-rates/file-uploader/file-uploader.component';

import { UploadRatesDialogComponent } from './rate-cards/dialog/upload-rates/upload-rates-dialog.component';
import { AddRateCardDialogComponent } from './rate-cards/dialog/add-rate-cards/add-rate-cards-dialog.component';

import { RateCardsService } from './rate-cards/services/rate-cards.service';

// Rates


// Accounts
import { AccountsComponent } from './accounts/accounts.component';
import { RatesTableComponent } from './rates-table/rates-table.component';

@NgModule({
  declarations:
  [
    AppComponent,
    SideNavComponent, TopNavComponent,
    DashboardComponent,
    CarrierComponent, CarrierTableComponent, CarrierUiComponent, AddCarrierDialogComponent, DelCarrierDialogComponent,
    RateCardsComponent, RateCardsTableComponent, FileUploaderComponent, FileSelectDirective, RateCardsUiComponent,
    AddRateCardDialogComponent, UploadRatesDialogComponent,
    RatesTableComponent,
    AccountsComponent,
  ],
  imports:
  [
    // Core Angular Modules
    HttpModule, HttpClientModule, BrowserModule,
    FormsModule, CommonModule, ReactiveFormsModule,
    // Angular Materials Modules
    BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatStepperModule, MatButtonModule, MatSelectModule, MatCheckboxModule,
    MatRadioModule, MatIconModule, MatDialogModule,
    //
    AgGridModule.withComponents([ ]),
    RouterModule.forRoot([
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'carrier', component: CarrierComponent},
      {path: 'rates', component: RateCardsComponent},
      {path: 'rates-table', component: RatesTableComponent},
      {path: 'accounts', component: AccountsComponent},
    ])
  ],
  providers: [ CarrierService, TableService ], // Applications services
  bootstrap: [ AppComponent ],
  entryComponents: [ AddCarrierDialogComponent, DelCarrierDialogComponent,
    AddRateCardDialogComponent, UploadRatesDialogComponent
  ] , // Add in dialog
})

export class AppModule { }
