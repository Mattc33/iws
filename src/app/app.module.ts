// * Core Modules
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

// * UI Library: Angular Materials
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatStepperModule, MatSelectModule } from '@angular/material'
import { MatIconModule, MatRadioModule, MatDialogModule, MatDatepickerModule } from '@angular/material'
import { MatNativeDateModule, MatAutocompleteModule, MatSliderModule, MatSnackBarModule } from '@angular/material'
import { MatToolbarModule, MatTabsModule, MatExpansionModule, MatCheckboxModule } from '@angular/material'
import 'hammerjs'

// ! Third Party Components
import { AgGridModule } from 'ag-grid-angular'
import { PapaParseModule } from 'ngx-papaparse'
import { SidebarModule } from 'ng-sidebar'
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd'

// ? Main/Layout components
import { AppComponent } from './app.component';
import { SideNavComponent } from './Containers/side-nav/side-nav.component'
import { TopNavComponent } from './Containers/top-nav/top-nav.component'
import { LoginComponent } from './Containers/login/login.component'

// ? Global Services
import { NestedAgGridService } from './shared/services/global/nestedAgGrid.shared.service'
import { ToggleButtonStateService } from './shared/services/global/buttonStates.shared.service'
import { ApiSettingsSharedService } from './shared/services/global/api-settings.shared.service'
import { CodesSharedService } from './shared/services/global/codes.shared.service'
import { LoginService } from './shared/api-services/login/login.api.service'

import { SnackbarSharedService } from './shared/services/global/snackbar.shared.service'
import { SuccessSnackbarComponent } from './shared/components/snackbars/success/success.snackbar.component'
import { ErrorSnackbarComponent } from './shared/components/snackbars/error/error.snackbar.component'

// ? DashBoard
import { DashboardComponent } from './Components/dashboard/dashboard.component'

// ? Carrier
import { CarrierTableComponent } from './Components/carrier/carrier-table/carrier-table.component'
    import { AddCarrierDialogComponent } from './Components/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component'
    import { DelCarrierDialogComponent } from './Components/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component'
import { CarrierService } from './shared/api-services/carrier/carrier.api.service'
import { CarrierSharedService } from './shared/services/carrier/carrier.shared.service'

// ? Ratecard
import { RateCardsTableComponent } from './Components/ratecard/rate-cards-table/rate-cards-table.component'
import { DeleteRateCardsDialogComponent } from './Components/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component'
import { RateCardsAddTrunksComponent } from './Components/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component'
import { RateCardsConvertCsvComponent } from './Components/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component'
import { IsoCodesSharedService } from './shared/services/ratecard/iso-codes.shared.service'
import { RateCardsService } from './shared/api-services/ratecard/rate-cards.api.service'
import { RateCardsSharedService } from './shared/services/ratecard/rate-cards.shared.service'

    // ? Ratecard Importer
    import { ImporterTableComponent } from './Components/ratecard/ratecard-importer/importer-table/importer-table.component'
    import { ImporterService } from './shared/api-services/ratecard/importer.api.service'
    import { ImporterSharedService } from './shared/services/ratecard/importer.shared.service'
    import { UploadRatesDialogComponent } from './Components/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component'
    import { RatecardImporterUtils } from './shared/utils/ratecard/rate-card-importer.utils'

    // ? Ratecard View By Carrier
    import { RatecardViewCarrierSComponent } from './Components/ratecard/ratecard-view-carrier-s/ratecard-view-carrier-s.component'
    import { RatecardViewCarrierPComponent } from './Components/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component'

    import { MainTableSharedService } from './shared/services/ratecard/main-table.shared.service'
    import { MainTableCommonSharedService } from './shared/services/ratecard/main-table-common.shared.service'

    // ? Ratecard Manager
    import { RateCardManagerComponent } from './Components/ratecard/rate-card-manager/rate-card-manager.component'
    import { CarrierCellComponent } from './Components/ratecard/rate-card-manager/carrier-cell/carrier-cell.component'
    import { ObietelCellComponent } from './Components/ratecard/rate-card-manager/obietel-cell/obietel-cell.component'
    import { RatecardManagerService } from './shared/api-services/ratecard/rate-card-manager.api.service'
    import { RateTableModalComponent } from './Components/ratecard/rate-card-manager/rate-table-modal/rate-table-modal.component'
    import { RatecardsManagerSharedService } from './shared/services/ratecard-manager/rate-cards-manager.shared.service'
    import { RatecardManagerUtils } from './shared/utils/ratecard/rate-card-manager.utils'
    import { RateCardManagerToolbarComponent } from './Components/ratecard/rate-card-manager/rate-card-manager-toolbar/rate-card-manager-toolbar.component'
    import { CarrierHeaderComponent } from './Components/ratecard/rate-card-manager/carrier-header/carrier-header.component'
    import { CountryCodeRowDataSharedService } from './shared/services/ratecard-manager/country-row-data.shared'

// ? Trunks
import { TrunksTableComponent } from './Components/trunks/trunks-table/trunks-table.component'

import { AddTrunksComponent } from './Components/trunks/trunks-table/dialog/add-trunks/add-trunks.component'
import { DeleteTrunksComponent } from './Components/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component'
import { DeleteRatesComponent } from './Components/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component'
import { DetachTrunksComponent } from './Components/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component'

import { TrunksService } from './shared/api-services/trunk/trunks.api.service'
import { TrunksSharedService } from './shared/services/trunk/trunks.shared.service'

// ? Call Plan
import { CallPlanTableComponent } from './Components/callplan/call-plan-table/call-plan-table.component'
    import { AddCallPlanComponent } from './Components/callplan/call-plan-table/dialog/add-callplan/add-callplan.component'
    import { DelCallPlanComponent } from './Components/callplan/call-plan-table/dialog/del-callplan/del-callplan.component'
    import { AddRateCardComponent } from './Components/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component'
    import { DettachRatecardsComponent } from './Components/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component'
    import { AddCodeComponent } from './Components/callplan/call-plan-table/dialog/add-code/add-code.component'
    import { DettachCodesComponent } from './Components/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component'

import { CallPlanAddRatecardComponent } from './Components/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component'
import { CallPlanAddCodeComponent } from './Components/callplan/call-plan-add-code/call-plan-add-code.component'

import { CallPlanService } from './shared/api-services/callplan/call-plan.api.service'
import { CallPlanSharedService } from './shared/services/callplan/call-plan.shared.service'
import { CodesFormSharedService } from './shared/services/callplan/attach-callplan-codes.shared.service'

// ? LCR
import { LcrCallPlanTableComponent } from './Components/lcr/lcr-callplan-table/lcr-callplan-table.component'
import { LcrCarrierTableComponent } from './Components/lcr/lcr-carrier-table/lcr-carrier-table.component'
import { LcrRatecardTableComponent } from './Components/lcr/lcr-ratecard-table/lcr-ratecard-table.component'
import { LcrTrunkTableComponent } from './Components/lcr/lcr-trunk-table/lcr-trunk-table.component'

import { LCRService } from './shared/api-services/lcr/lcr.api.service'
import { LCRSharedService } from './shared/services/lcr/lcr.shared.service'

// ? Accounts
import { InvoiceComponent } from './Components/invoice/invoice.component'
import { InvoiceService } from './shared/api-services/invoice/invoice.api.service'


import { ExpandCollaspeComponent } from './shared/components/buttons/expand-collaspe/expand-collaspe.component'

// ? App Module Service
import { AppRoutes } from './Containers/routes/routes'

// ? config angular i18n
import { registerLocaleData } from '@angular/common'
import en from '@angular/common/locales/en'
import { RateCardsStatusComponent } from './Components/ratecard/rate-cards-status/rate-cards-status.component'
import { AntdUploadAreaComponent } from './shared/components/uploadarea/antd-upload-area/antd-upload-area.component';
import { RateCardPreviewerComponent } from './Components/ratecard/rate-card-previewer/rate-card-previewer.component';
import { EffdateHeaderComponent } from './Components/ratecard/rate-card-previewer/effdate-header/effdate-header.component';
import { RateCardPreviewerToolbarComponent } from './Components/ratecard/rate-card-previewer/rate-card-previewer-toolbar/rate-card-previewer-toolbar.component';
import { RateCardPreviewerSidebarComponent } from './Components/ratecard/rate-card-previewer/rate-card-previewer-sidebar/rate-card-previewer-sidebar.component';
import { RateCardManagerSaveprofileComponent } from './Components/ratecard/rate-card-manager/rate-card-manager-saveprofile/rate-card-manager-saveprofile.component'

registerLocaleData(en);

@NgModule({
    declarations: [
        // ? Main Layout Components
        AppComponent, SideNavComponent, TopNavComponent,

        // ? User
        LoginComponent,

        // ? Dashboard
        DashboardComponent,

        // ? Carrier
        CarrierTableComponent, AddCarrierDialogComponent, DelCarrierDialogComponent,

        // ? Ratecard
        RateCardsTableComponent, DeleteRateCardsDialogComponent, ImporterTableComponent,

        // ? Ratecard Viewer
        RatecardViewCarrierSComponent, RatecardViewCarrierPComponent,
        UploadRatesDialogComponent, RateCardsAddTrunksComponent, RateCardsConvertCsvComponent,
        DeleteRatesComponent,

        // ? Ratecard Manager
        RateCardManagerComponent, CarrierCellComponent, ObietelCellComponent, 
        CarrierHeaderComponent, RateCardManagerToolbarComponent, 
        // ? Trunk
        TrunksTableComponent, AddTrunksComponent, DeleteTrunksComponent, DetachTrunksComponent,

        // ? Call Plan
        CallPlanTableComponent, AddCallPlanComponent, DelCallPlanComponent, CallPlanAddRatecardComponent,
        CallPlanAddCodeComponent, AddCodeComponent, AddRateCardComponent, DettachRatecardsComponent,
        DettachCodesComponent,

        // ? LCR
        LcrCallPlanTableComponent, LcrCarrierTableComponent, LcrRatecardTableComponent, LcrTrunkTableComponent,

        // ? Account
        InvoiceComponent,

        // ? Global
        SuccessSnackbarComponent, ErrorSnackbarComponent, ExpandCollaspeComponent, RateTableModalComponent, 
        RateCardsStatusComponent, AntdUploadAreaComponent, RateCardPreviewerComponent, EffdateHeaderComponent, RateCardPreviewerToolbarComponent, RateCardPreviewerSidebarComponent, RateCardManagerSaveprofileComponent, 
    ],
    imports: [
        // ? Core Angular Modules
        HttpModule, HttpClientModule, BrowserModule,
        FormsModule, CommonModule, ReactiveFormsModule,
        BrowserAnimationsModule,

        // ? Third Party Modules
        PapaParseModule, SidebarModule,
        AgGridModule.withComponents([CarrierCellComponent, ObietelCellComponent, CarrierHeaderComponent]),

        // ? Angular Materials Modules
        MatFormFieldModule, MatInputModule, MatStepperModule, MatButtonModule, MatSelectModule, MatCheckboxModule,
        MatRadioModule, MatIconModule, MatDialogModule, MatToolbarModule, MatDatepickerModule, MatNativeDateModule,
        MatTabsModule, MatAutocompleteModule, MatExpansionModule, MatSliderModule, MatSnackBarModule,

        // ? Ag Grid & Routing
        RouterModule.forRoot(AppRoutes),
        NgZorroAntdModule
    ],
    providers: [
        // ? Global services
        NestedAgGridService, SnackbarSharedService, ToggleButtonStateService, CodesSharedService,
        ApiSettingsSharedService, LoginService,

        // ? Carrier
        CarrierService, CarrierSharedService,

        // ? Ratecard
        ImporterService, ImporterSharedService, RateCardsService, 
        RateCardsSharedService, RatecardImporterUtils,

        // ? Ratecard Viewer
        IsoCodesSharedService, MainTableSharedService,
        MainTableCommonSharedService,

        // ? Ratecard Manager
        RatecardManagerService, RatecardsManagerSharedService,
        RatecardManagerUtils, CountryCodeRowDataSharedService,

        // ? Trunk
        TrunksService, TrunksSharedService,

        CallPlanService, CallPlanSharedService, CodesFormSharedService,

        InvoiceService,

        LCRService, LCRSharedService,
        { provide: NZ_I18N, useValue: en_US }
    ],
    bootstrap: [ AppComponent ],
    entryComponents: [
        // ? Carrier
        AddCarrierDialogComponent, DelCarrierDialogComponent,

        // ? Ratecard
        DeleteRateCardsDialogComponent, UploadRatesDialogComponent,

        // ? Global
        SuccessSnackbarComponent, ErrorSnackbarComponent,

        DeleteTrunksComponent, AddTrunksComponent, DeleteRatesComponent, DetachTrunksComponent, // Trunks
        AddCallPlanComponent, DelCallPlanComponent, AddCodeComponent, AddRateCardComponent, // Callplans
        DettachRatecardsComponent, DettachCodesComponent
    ]
})

export class AppModule { }
