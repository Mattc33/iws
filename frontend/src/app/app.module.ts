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
import { MatIconModule, MatRadioModule, MatDialogModule, MatDatepickerModule } from '@angular/material';
import { MatNativeDateModule, MatAutocompleteModule, MatSliderModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

/* -------------------------------------------------------------------------------------------------------------------------------------- */

// Main components
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';

// Global Services
import { NestedAgGridService } from './global-service/nestedAgGrid.shared.service';

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

// Ratecard Importer
import { RatecardImporterComponent } from './ratecard-importer/ratecard-importer.component';
import { ImporterTableComponent } from './ratecard-importer/importer-table/importer-table.component';

import { ImporterService } from './ratecard-importer/services/importer.api.service';
import { ImporterSharedService } from './ratecard-importer/services/importer.shared.service';

import { UploadRatesDialogComponent } from './ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component';

// Rates Card
import { RateCardsComponent } from './rate-cards/rate-cards.component';
import { RateCardsTableComponent } from './rate-cards/rate-cards-table/rate-cards-table.component';

import { AttachTrunksDialogComponent } from './rate-cards/rate-cards-table/dialog/attach-trunks/attach-trunks-dialog.component';
import { DeleteRateCardsDialogComponent } from './rate-cards/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component';

import { RateCardsService } from './rate-cards/services/rate-cards.api.service';
import { RateCardsSharedService } from './rate-cards/services/rate-cards.shared.service';

// Trunks
import { TrunksComponent } from './trunks/trunks.component';
import { TrunksTableComponent } from './trunks/trunks-table/trunks-table.component';

import { AddTrunksComponent } from './trunks/trunks-table/dialog/add-trunks/add-trunks.component';
import { DeleteTrunksComponent } from './trunks/trunks-table/dialog/delete-trunks/delete-trunks.component';
import { DeleteRatesComponent } from './rate-cards/rate-cards-table/dialog/delete-rates/delete-rates.component';
import { DetachTrunksComponent } from './rate-cards/rate-cards-table/dialog/detach-trunks/detach-trunks.component';

import { TrunksService } from './trunks/services/trunks.api.service';
import { TrunksSharedService } from './trunks/services/trunks.shared.service';

// Call Plan
import { CallPlanComponent } from './call-plan/call-plan.component';
import { CallPlanTableComponent } from './call-plan/call-plan-table/call-plan-table.component';

import { AddCallPlanComponent } from './call-plan/call-plan-table/dialog/add-callplan/add-callplan.component';
import { DelCallPlanComponent } from './call-plan/call-plan-table/dialog/del-callplan/del-callplan.component';
import { AddRateCardComponent } from './call-plan/call-plan-table/dialog/add-rate-card/add-rate-card.component';
import { AddCodeComponent } from './call-plan/call-plan-table/dialog/add-code/add-code.component';
import { DettachRatecardsComponent } from './call-plan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component';
import { DettachCodesComponent } from './call-plan/call-plan-table/dialog/dettach-codes/dettach-codes.component';

import { CallPlanService } from './call-plan/services/call-plan.api.service';
import { CallPlanSharedService } from './call-plan/services/call-plan.shared.service';
import { CodesSharedService } from './call-plan/services/codes.shared.service';

// Accounts
import { AccountsComponent } from './accounts/accounts.component';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';


@NgModule({
  declarations:
  [
    AppComponent, SideNavComponent, TopNavComponent, LoginComponent, RegistrationComponent, // Main
    DashboardComponent, // Dashboard
    CarrierComponent, CarrierTableComponent, AddCarrierDialogComponent, DelCarrierDialogComponent, // Carrier
    RateCardsComponent, RateCardsTableComponent, AttachTrunksDialogComponent, DeleteRateCardsDialogComponent, // RateCards
    UploadRatesDialogComponent,
    TrunksComponent,  TrunksTableComponent, AddTrunksComponent, DeleteTrunksComponent, DeleteRatesComponent, // Trunks
    DetachTrunksComponent,
    CallPlanComponent, CallPlanTableComponent, AddCallPlanComponent, DelCallPlanComponent, // Call Plan
    AddRateCardComponent, AddCodeComponent, DettachRatecardsComponent, DettachCodesComponent,
    AccountsComponent,
    RatecardImporterComponent,
    ImporterTableComponent,
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
    MatTabsModule, MatAutocompleteModule, MatExpansionModule, MatSliderModule,
    // Ag Grid & Routing
    AgGridModule.withComponents([ ]),
    RouterModule.forRoot([
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'carrier', component: CarrierComponent},
      {path: 'ratecard-importer', component: RatecardImporterComponent},
      {path: 'rate-cards', component: RateCardsComponent},
      {path: 'trunks', component: TrunksComponent},
      {path: 'call-plan', component: CallPlanComponent},
      {path: 'accounts', component: AccountsComponent},
      {path: 'login', component: LoginComponent},
      {path: 'registration', component: RegistrationComponent}
    ])
  ],
    providers: [
        NestedAgGridService,
        CarrierService, CarrierSharedService,
        ImporterService, ImporterSharedService,
        RateCardsService, RateCardsSharedService,
        TrunksService, TrunksSharedService,
        CallPlanService, CallPlanSharedService, CodesSharedService,
    ], // Applications services
    bootstrap: [ AppComponent ],
    entryComponents: [
        AddCarrierDialogComponent, DelCarrierDialogComponent, // Carrier
        UploadRatesDialogComponent, // Importer
        AttachTrunksDialogComponent, DeleteRateCardsDialogComponent, // Ratecards
        DeleteTrunksComponent, AddTrunksComponent, DeleteRatesComponent, DetachTrunksComponent, // Trunks
        AddCallPlanComponent, DelCallPlanComponent, AddRateCardComponent, AddCodeComponent, // Callplans
        DettachRatecardsComponent, DettachCodesComponent
    ] , // Add in dialog
})

export class AppModule { }
