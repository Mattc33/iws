// Core Modules
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
import { MatCheckboxModule, MatIconModule, MatRadioModule, MatDialogModule, MatDatepickerModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

/* --------------------------------------------------------------------------------------------------------------------------------------
   -------------------------------------------------------------------------------------------------------------------------------------- */

// Main components
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';

import { GlobalSharedService } from './global-services/global-service.shared.service';

// Third Party Components
import { AgGridModule } from 'ag-grid-angular';
import { PapaParseModule } from 'ngx-papaparse';

// DashBoard
import { DashboardComponent } from './dashboard/dashboard.component';

// Carrier
import { CarrierComponent } from './carrier/carrier.component';
import { CarrierTableComponent } from './carrier/carrier-table/carrier-table.component';

import { AddCarrierDialogComponent } from './carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component';
import { DelCarrierDialogComponent } from './carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component';

import { CarrierService } from './carrier/services/carrier.api.service';
import { CarrierSharedService } from './carrier/services/carrier.shared.service';

// Rates Card
import { RateCardsComponent } from './rate-cards/rate-cards.component';
import { RateCardsTableComponent } from './rate-cards/rate-cards-table/rate-cards-table.component';

import { AddRateCardDialogComponent } from './rate-cards/rate-cards-table/dialog/add-rate-cards/add-rate-cards-dialog.component';
import { DeleteRateCardsDialogComponent } from './rate-cards/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component';
import { UploadRatesDialogComponent } from './rate-cards/rate-cards-table/dialog/upload-rates/upload-rates-dialog.component';

import { RateCardsService } from './rate-cards/services/rate-cards.api.service';
import { RateCardsSharedService } from './rate-cards/services/rate-cards.shared.service';

// Rates
import { RatesComponent } from './rates/rates.component';
import { RatesTableComponent } from './rates/rates-table/rates-table.component';
import { RatesTableTeleUComponent } from './rates/rates-table/rates-table-tele-u/rates-table-tele-u.component';
import { RatesTableAllComponent } from './rates/rates-table/rates-table-all/rates-table-all.component';

import { DeleteTeleuRatesDialogComponent } from './rates/rates-table/rates-table-tele-u/dialog/delete-rates-teleu/delete-rates-teleu-dialog.component';
import { DeleteAllRatesDialogComponent } from './rates/rates-table/rates-table-all/dialog/delete-rates-all/delete-rates-all-dialog.component';

import { RatesService } from './rates/services/rates.api.service';
import { RatesSharedService } from './rates/services/rates.shared.service';

// Call Plan
import { CallPlanComponent } from './call-plan/call-plan.component';
import { CallPlanTableComponent } from './call-plan/call-plan-table/call-plan-table.component';

import { AddCallPlanComponent } from './call-plan/call-plan-table/dialog/add-callplan/add-callplan.component';
import { DelCallPlanComponent } from './call-plan/call-plan-table/dialog/del-callplan/del-callplan.component';
import { AddRateCardComponent } from './call-plan/call-plan-table/dialog/add-rate-card/add-rate-card.component';
import { AddCodeComponent } from './call-plan/call-plan-table/dialog/add-code/add-code.component';

import { CallPlanService } from './call-plan/services/call-plan.api.service';
import { CallPlanSharedService } from './call-plan/services/call-plan.shared.service';

// Accounts
import { AccountsComponent } from './accounts/accounts.component';


import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  declarations:
  [
    AppComponent,
    SideNavComponent, TopNavComponent, LoginComponent, RegistrationComponent,
    DashboardComponent,
    CarrierComponent, CarrierTableComponent, AddCarrierDialogComponent, DelCarrierDialogComponent,
    RateCardsComponent, RateCardsTableComponent, AddRateCardDialogComponent, DeleteRateCardsDialogComponent,
    RatesComponent, RatesTableComponent, UploadRatesDialogComponent, DeleteAllRatesDialogComponent,
    RatesTableTeleUComponent, RatesTableAllComponent, DeleteTeleuRatesDialogComponent,
    CallPlanComponent, CallPlanTableComponent, AddCallPlanComponent, DelCallPlanComponent, 
    AddRateCardComponent, AddCodeComponent,
    AccountsComponent,
  ],
  imports:
  [
    // Core Angular Modules
    HttpModule, HttpClientModule, BrowserModule,
    FormsModule, CommonModule, ReactiveFormsModule,
    // Third Party Modules
    PapaParseModule,
    // Angular Materials Modules
    BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatStepperModule, MatButtonModule, MatSelectModule, MatCheckboxModule,
    MatRadioModule, MatIconModule, MatDialogModule, MatToolbarModule, MatTooltipModule, MatDatepickerModule, MatNativeDateModule,
    MatTabsModule,
    // Ag Grid & Routing
    AgGridModule.withComponents([ ]),
    RouterModule.forRoot([
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'carrier', component: CarrierComponent},
      {path: 'rate-cards', component: RateCardsComponent},
      {path: 'rates', component: RatesComponent},
      {path: 'call-plan', component: CallPlanComponent},
      {path: 'accounts', component: AccountsComponent},
      {path: 'login', component: LoginComponent},
      {path: 'registration', component: RegistrationComponent},
    ])
  ],
  providers: [ 
    GlobalSharedService,
    CarrierService, CarrierSharedService,
    RateCardsService, RateCardsSharedService,
    RatesService, RatesSharedService,
    CallPlanService, CallPlanSharedService ], // Applications services
  bootstrap: [ AppComponent ],
  entryComponents: [ 
    AddCarrierDialogComponent, DelCarrierDialogComponent,
    AddRateCardDialogComponent, DeleteRateCardsDialogComponent, UploadRatesDialogComponent,
    DeleteAllRatesDialogComponent, DeleteTeleuRatesDialogComponent,
    AddCallPlanComponent, DelCallPlanComponent, AddRateCardComponent, AddCodeComponent
  ] , // Add in dialog
})

export class AppModule { }
