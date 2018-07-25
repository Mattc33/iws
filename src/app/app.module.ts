// * Core Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';

// * UI Library: Angular Materials
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatStepperModule, MatSelectModule } from '@angular/material';
import { MatIconModule, MatRadioModule, MatDialogModule, MatDatepickerModule } from '@angular/material';
import { MatNativeDateModule, MatAutocompleteModule, MatSliderModule, MatSnackBarModule } from '@angular/material';
import { MatToolbarModule, MatTabsModule, MatExpansionModule, MatCheckboxModule } from '@angular/material';
import 'hammerjs';

// ? Main components
import { AppComponent } from './app.component';
import { SideNavComponent } from './Containers/side-nav/side-nav.component';
import { TopNavComponent } from './Containers/top-nav/top-nav.component';
import { LoginComponent } from './Containers/login/login.component';
import { RegistrationComponent } from './Containers/registration/registration.component';

// ? Global Services
import { NestedAgGridService } from './shared/services/global/nestedAgGrid.shared.service';
import { ToggleButtonStateService } from './shared/services/global/buttonStates.shared.service';
import { ApiSettingsSharedService } from './shared/services/global/api-settings.shared.service';
import { CodesSharedService } from './shared/services/global/codes.shared.service';

import { SnackbarSharedService } from './shared/services/global/snackbar.shared.service';
import { SuccessSnackbarComponent } from './shared/components/snackbars/success/success.snackbar.component';
import { ErrorSnackbarComponent } from './shared/components/snackbars/error/error.snackbar.component';

// ! Third Party Components
import { AgGridModule } from 'ag-grid-angular';
import { PapaParseModule } from 'ngx-papaparse';
import { SidebarModule } from 'ng-sidebar';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';

// ? DashBoard
import { DashboardComponent } from './Components/dashboard/dashboard.component';

// ? Carrier
import { CarrierTableComponent } from './Components/carrier/carrier-table/carrier-table.component';
    import { AddCarrierDialogComponent } from './Components/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component';
    import { DelCarrierDialogComponent } from './Components/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component';
import { CarrierService } from './shared/api-services/carrier/carrier.api.service';
import { CarrierSharedService } from './shared/services/carrier/carrier.shared.service';

// ? Ratecard
import { RateCardsTableComponent } from './Components/ratecard/rate-cards-table/rate-cards-table.component';
import { DeleteRateCardsDialogComponent } from './Components/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component';
import { RateCardsAddTrunksComponent } from './Components/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component';
import { RateCardsConvertCsvComponent } from './Components/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component';
import { RateCardManagerComponent } from './Components/ratecard/rate-card-manager/rate-card-manager.component';

import { IsoCodesSharedService } from './shared/services/ratecard/iso-codes.shared.service';
import { RateCardsService } from './shared/api-services/ratecard/rate-cards.api.service';
import { RateCardsSharedService } from './shared/services/ratecard/rate-cards.shared.service';

// ? Ratecard Importer
import { ImporterTableComponent } from './Components/ratecard/ratecard-importer/importer-table/importer-table.component';

import { ImporterService } from './shared/api-services/ratecard/importer.api.service';
import { ImporterSharedService } from './shared/services/ratecard/importer.shared.service';
import { UploadRatesDialogComponent } from './Components/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component';

// ? Ratecard View By Carrier
import { RatecardViewCarrierSComponent } from './Components/ratecard/ratecard-view-carrier-s/ratecard-view-carrier-s.component';
import { RatecardViewCarrierPComponent } from './Components/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component';

import { MainTableSharedService } from './shared/services/ratecard/main-table.shared.service';
import { MainTableCommonSharedService } from './shared/services/ratecard/main-table-common.shared.service';

// ? Trunks
import { TrunksTableComponent } from './Components/trunks/trunks-table/trunks-table.component';

import { AddTrunksComponent } from './Components/trunks/trunks-table/dialog/add-trunks/add-trunks.component';
import { DeleteTrunksComponent } from './Components/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component';
import { DeleteRatesComponent } from './Components/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component';
import { DetachTrunksComponent } from './Components/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component';

import { TrunksService } from './shared/api-services/trunk/trunks.api.service';
import { TrunksSharedService } from './shared/services/trunk/trunks.shared.service';

// ? Call Plan
import { CallPlanTableComponent } from './Components/callplan/call-plan-table/call-plan-table.component';
    import { AddCallPlanComponent } from './Components/callplan/call-plan-table/dialog/add-callplan/add-callplan.component';
    import { DelCallPlanComponent } from './Components/callplan/call-plan-table/dialog/del-callplan/del-callplan.component';
    import { AddRateCardComponent } from './Components/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component';
    import { DettachRatecardsComponent } from './Components/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component';
    import { AddCodeComponent } from './Components/callplan/call-plan-table/dialog/add-code/add-code.component';
    import { DettachCodesComponent } from './Components/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component';

import { CallPlanAddRatecardComponent } from './Components/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component';
import { CallPlanAddCodeComponent } from './Components/callplan/call-plan-add-code/call-plan-add-code.component';

import { CallPlanService } from './shared/api-services/callplan/call-plan.api.service';
import { CallPlanSharedService } from './shared/services/callplan/call-plan.shared.service';
import { CodesFormSharedService } from './shared/services/callplan/attach-callplan-codes.shared.service';

// ? LCR
import { LcrCallPlanTableComponent } from './Components/lcr/lcr-callplan-table/lcr-callplan-table.component';
import { LcrCarrierTableComponent } from './Components/lcr/lcr-carrier-table/lcr-carrier-table.component';
import { LcrRatecardTableComponent } from './Components/lcr/lcr-ratecard-table/lcr-ratecard-table.component';
import { LcrTrunkTableComponent } from './Components/lcr/lcr-trunk-table/lcr-trunk-table.component';

import { LCRService } from './shared/api-services/lcr/lcr.api.service';
import { LCRSharedService } from './shared/services/lcr/lcr.shared.service';

// ? Accounts
import { AccountsComponent } from './Components/accounts/accounts.component';
import { ExpandCollaspeComponent } from './shared/components/buttons/expand-collaspe/expand-collaspe.component';

// ? App Module Service
import { AppRoutes } from './Containers/routes/routes';

// ? config angular i18n
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);

@NgModule({
    declarations:
    [
        // Main Layout Components
        AppComponent, SideNavComponent, TopNavComponent,
        // User
        LoginComponent, RegistrationComponent,
        // Dashboard
        DashboardComponent,
        // Carrier
        CarrierTableComponent, AddCarrierDialogComponent, DelCarrierDialogComponent,
        // Ratecard
        RateCardsTableComponent, DeleteRateCardsDialogComponent, ImporterTableComponent,
        UploadRatesDialogComponent, RateCardsAddTrunksComponent, RateCardsConvertCsvComponent, DeleteRatesComponent,
        RatecardViewCarrierSComponent, RatecardViewCarrierPComponent,
        // Trunk
        TrunksTableComponent, AddTrunksComponent, DeleteTrunksComponent, DetachTrunksComponent,
        // Call Plan
        CallPlanTableComponent, AddCallPlanComponent, DelCallPlanComponent, CallPlanAddRatecardComponent,
        CallPlanAddCodeComponent, AddCodeComponent, AddRateCardComponent, DettachRatecardsComponent,
        DettachCodesComponent,
        // LCR
        LcrCallPlanTableComponent, LcrCarrierTableComponent, LcrRatecardTableComponent, LcrTrunkTableComponent,
        // Account
        AccountsComponent,
        // Global
        SuccessSnackbarComponent, ErrorSnackbarComponent, ExpandCollaspeComponent, RateCardManagerComponent,
    ],
  imports:
  [
    // Core Angular Modules
    HttpModule, HttpClientModule, BrowserModule,
    FormsModule, CommonModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    // Third Party Modules
    PapaParseModule, SidebarModule,
    AgGridModule.withComponents([]),
    BrowserAnimationsModule,
    // Angular Materials Modules
    MatFormFieldModule, MatInputModule, MatStepperModule, MatButtonModule, MatSelectModule, MatCheckboxModule,
    MatRadioModule, MatIconModule, MatDialogModule, MatToolbarModule, MatDatepickerModule, MatNativeDateModule,
    MatTabsModule, MatAutocompleteModule, MatExpansionModule, MatSliderModule, MatSnackBarModule,
    // Ag Grid & Routing
    RouterModule.forRoot(AppRoutes),
    NgZorroAntdModule
  ],
    providers: [
        // ? Global services
        NestedAgGridService, SnackbarSharedService, ToggleButtonStateService, CodesSharedService,
        ApiSettingsSharedService,

        // ? Carrier
        CarrierService, CarrierSharedService,

        // ? Ratecard
        ImporterService, ImporterSharedService, RateCardsService, RateCardsSharedService,

        // ? Ratecard Viewer
        IsoCodesSharedService, MainTableSharedService,
        MainTableCommonSharedService,

        TrunksService, TrunksSharedService,
        CallPlanService, CallPlanSharedService, CodesFormSharedService,
        LCRService, LCRSharedService,
        { provide: NZ_I18N, useValue: en_US }
    ],
    bootstrap: [ AppComponent ],
    entryComponents: [
        // Carrier
        AddCarrierDialogComponent, DelCarrierDialogComponent,
        // Ratecard
        DeleteRateCardsDialogComponent, UploadRatesDialogComponent,
        SuccessSnackbarComponent, ErrorSnackbarComponent,
        DeleteTrunksComponent, AddTrunksComponent, DeleteRatesComponent, DetachTrunksComponent, // Trunks
        AddCallPlanComponent, DelCallPlanComponent, AddCodeComponent, AddRateCardComponent, // Callplans
        DettachRatecardsComponent, DettachCodesComponent
    ] , // Add in dialog
})

export class AppModule { }
