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
import { MatNativeDateModule, MatAutocompleteModule, MatSliderModule, MatSnackBarModule } from '@angular/material';
import { MatToolbarModule, MatTabsModule, MatExpansionModule, MatCheckboxModule } from '@angular/material';

// Main components
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';

// Global Services
import { NestedAgGridService } from './global-service/nestedAgGrid.shared.service';
import { ToggleButtonStateService } from './shared/services/global/buttonStates.shared.service';
import { ApiSettingsSharedService } from './global-service/api-settings.shared.service';

import { SnackbarSharedService } from './shared/services/global/snackbar.shared.service';
import { SuccessSnackbarComponent } from './shared/components/snackbars/success/success.snackbar.component';
import { ErrorSnackbarComponent } from './shared/components/snackbars/error/error.snackbar.component';

// Third Party Components
import { AgGridModule } from 'ag-grid-angular';
import { PapaParseModule } from 'ngx-papaparse';

// DashBoard
import { DashboardComponent } from './dashboard/dashboard.component';

// Carrier
import { CarrierTableComponent } from './carrier/carrier-table/carrier-table.component';

import { AddCarrierDialogComponent } from './carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component';
import { DelCarrierDialogComponent } from './carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component';

import { CarrierService } from './carrier/services/carrier.api.service';
import { CarrierSharedService } from './carrier/services/carrier.shared.service';

// Ratecard
import { RateCardsTableComponent } from './ratecard/rate-cards-table/rate-cards-table.component';
import { DeleteRateCardsDialogComponent } from './ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component';
import { RateCardsAddTrunksComponent } from './ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component';
import { RateCardsConvertCsvComponent } from './ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component';

import { RateCardsService } from './ratecard/services/rate-cards.api.service';
import { RateCardsSharedService } from './ratecard/services/rate-cards.shared.service';

// Ratecard Importer
import { ImporterTableComponent } from './ratecard/ratecard-importer/importer-table/importer-table.component';

import { ImporterService } from './ratecard/ratecard-importer/services/importer.api.service';
import { ImporterSharedService } from './ratecard/ratecard-importer/services/importer.shared.service';
import { UploadRatesDialogComponent } from './ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component';



// Trunks
import { TrunksComponent } from './trunks/trunks.component';
import { TrunksTableComponent } from './trunks/trunks-table/trunks-table.component';

import { AddTrunksComponent } from './trunks/trunks-table/dialog/add-trunks/add-trunks.component';
import { DeleteTrunksComponent } from './trunks/trunks-table/dialog/delete-trunks/delete-trunks.component';
import { DeleteRatesComponent } from './ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component';
import { DetachTrunksComponent } from './ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component';

import { TrunksService } from './trunks/services/trunks.api.service';
import { TrunksSharedService } from './trunks/services/trunks.shared.service';

// Call Plan
import { CallPlanComponent } from './call-plan/call-plan.component';
import { CallPlanTableComponent } from './call-plan/call-plan-table/call-plan-table.component';

import { AddCallPlanComponent } from './call-plan/call-plan-table/dialog/add-callplan/add-callplan.component';
import { DelCallPlanComponent } from './call-plan/call-plan-table/dialog/del-callplan/del-callplan.component';
import { AddCodeComponent } from './call-plan/call-plan-table/dialog/add-code/add-code.component';
import { DettachRatecardsComponent } from './call-plan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component';
import { DettachCodesComponent } from './call-plan/call-plan-table/dialog/dettach-codes/dettach-codes.component';

import { CallPlanService } from './call-plan/services/call-plan.api.service';
import { CallPlanSharedService } from './call-plan/services/call-plan.shared.service';
import { CodesSharedService } from './global-service/codes.shared.service';

// LCR
import { LcrCallPlanTableComponent } from './lcr/lcr-callplan-table/lcr-callplan-table.component';
import { LcrCarrierTableComponent } from './lcr/lcr-carrier-table/lcr-carrier-table.component';
import { LcrRatecardTableComponent } from './lcr/lcr-ratecard-table/lcr-ratecard-table.component';
import { LcrTrunkTableComponent } from './lcr/lcr-trunk-table/lcr-trunk-table.component';

import { LCRService } from './lcr/services/lcr.api.service';
import { LCRSharedService } from './lcr/services/lcr.shared.service';

// Accounts
import { AccountsComponent } from './accounts/accounts.component';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

import { CallPlanAddRatecardComponent } from './call-plan-add-ratecard/call-plan-add-ratecard.component';
import { CallPlanAddCodeComponent } from './call-plan-add-code/call-plan-add-code.component';


@NgModule({
  declarations:
  [
    AppComponent, SideNavComponent, TopNavComponent, LoginComponent, RegistrationComponent, // Main
    DashboardComponent, // Dashboard
    CarrierTableComponent, AddCarrierDialogComponent, DelCarrierDialogComponent, // Carrier
    ImporterTableComponent, // Importer
    RateCardsTableComponent, DeleteRateCardsDialogComponent, // RateCards
    UploadRatesDialogComponent, RateCardsAddTrunksComponent, RateCardsConvertCsvComponent,
    TrunksComponent,  TrunksTableComponent, AddTrunksComponent, DeleteTrunksComponent, DeleteRatesComponent, // Trunks
    DetachTrunksComponent,
    CallPlanComponent, CallPlanTableComponent, AddCallPlanComponent, DelCallPlanComponent, // Call Plan
    CallPlanAddRatecardComponent, CallPlanAddCodeComponent,
    AddCodeComponent, DettachRatecardsComponent, DettachCodesComponent,
    LcrCallPlanTableComponent, LcrCarrierTableComponent, LcrRatecardTableComponent, LcrTrunkTableComponent, // LCR
    AccountsComponent,
    SuccessSnackbarComponent, ErrorSnackbarComponent,
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
    MatRadioModule, MatIconModule, MatDialogModule, MatToolbarModule, MatDatepickerModule, MatNativeDateModule,
    MatTabsModule, MatAutocompleteModule, MatExpansionModule, MatSliderModule, MatSnackBarModule,
    // Ag Grid & Routing
    AgGridModule.withComponents([ ]),
    RouterModule.forRoot([
        {path: '', component: DashboardComponent},
        {path: 'dashboard', component: DashboardComponent},

        {path: 'carrier-view', component: CarrierTableComponent},

        {path: 'rate-card-importer', component: ImporterTableComponent},
        {path: 'rate-card-view', component: RateCardsTableComponent},
        {path: 'rate-card-add-trunks', component: RateCardsAddTrunksComponent},
        {path: 'rate-card-convert-csv', component: RateCardsConvertCsvComponent},

        {path: 'trunks', component: TrunksComponent},

        {path: 'call-plan-view', component: CallPlanComponent},
        {path: 'call-plan-add-ratecard', component: CallPlanAddRatecardComponent},

        {path: 'lcr-carrier', component: LcrCarrierTableComponent},
        {path: 'lcr-ratecard', component: LcrRatecardTableComponent},
        {path: 'lcr-trunk', component: LcrTrunkTableComponent},
        {path: 'lcr-callplan', component: LcrCallPlanTableComponent},

        {path: 'accounts', component: AccountsComponent},
        {path: 'login', component: LoginComponent},
        {path: 'registration', component: RegistrationComponent},

    ])
  ],
    providers: [
        NestedAgGridService, SnackbarSharedService, ToggleButtonStateService, CodesSharedService,   // Global services
        ApiSettingsSharedService, // Global services
        CarrierService, CarrierSharedService,
        ImporterService, ImporterSharedService,
        RateCardsService, RateCardsSharedService,
        TrunksService, TrunksSharedService,
        CallPlanService, CallPlanSharedService,
        LCRService, LCRSharedService,
    ], // Applications services
    bootstrap: [ AppComponent ],
    entryComponents: [
        SuccessSnackbarComponent, ErrorSnackbarComponent,
        AddCarrierDialogComponent, DelCarrierDialogComponent, // Carrier
        UploadRatesDialogComponent, // Importer
        DeleteRateCardsDialogComponent,  // Ratecards
        DeleteTrunksComponent, AddTrunksComponent, DeleteRatesComponent, DetachTrunksComponent, // Trunks
        AddCallPlanComponent, DelCallPlanComponent, AddCodeComponent, // Callplans
        DettachRatecardsComponent, DettachCodesComponent
    ] , // Add in dialog
})

export class AppModule { }
