"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var iso_codes_shared_service_1 = require("./shared/services/ratecard/iso-codes.shared.service");
// Core Modules
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
// UI Library: Angular Materials
var animations_1 = require("@angular/platform-browser/animations");
var material_1 = require("@angular/material");
var material_2 = require("@angular/material");
var material_3 = require("@angular/material");
var material_4 = require("@angular/material");
require("hammerjs");
// Main components
var app_component_1 = require("./app.component");
var side_nav_component_1 = require("./side-nav/side-nav.component");
var top_nav_component_1 = require("./top-nav/top-nav.component");
// Global Services
var nestedAgGrid_shared_service_1 = require("./shared/services/global/nestedAgGrid.shared.service");
var buttonStates_shared_service_1 = require("./shared/services/global/buttonStates.shared.service");
var api_settings_shared_service_1 = require("./shared/services/global/api-settings.shared.service");
var codes_shared_service_1 = require("./shared/services/global/codes.shared.service");
var snackbar_shared_service_1 = require("./shared/services/global/snackbar.shared.service");
var success_snackbar_component_1 = require("./shared/components/snackbars/success/success.snackbar.component");
var error_snackbar_component_1 = require("./shared/components/snackbars/error/error.snackbar.component");
// Third Party Components
var ag_grid_angular_1 = require("ag-grid-angular");
var ngx_papaparse_1 = require("ngx-papaparse");
var ng_sidebar_1 = require("ng-sidebar");
// DashBoard
var dashboard_component_1 = require("./dashboard/dashboard.component");
// Carrier
var carrier_table_component_1 = require("./carrier/carrier-table/carrier-table.component");
var add_carrier_dialog_component_1 = require("./carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component");
var del_carrier_dialog_component_1 = require("./carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component");
var carrier_profile_component_1 = require("./carrier/carrier-profile/carrier-profile.component");
var carrier_api_service_1 = require("./shared/api-services/carrier/carrier.api.service");
var carrier_shared_service_1 = require("./shared/services/carrier/carrier.shared.service");
// Ratecard
var rate_cards_table_component_1 = require("./ratecard/rate-cards-table/rate-cards-table.component");
var delete_rate_cards_dialog_component_1 = require("./ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component");
var rate_cards_add_trunks_component_1 = require("./ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component");
var rate_cards_convert_csv_component_1 = require("./ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component");
var ratecard_view_carrier_component_1 = require("./ratecard/ratecard-view-carrier/ratecard-view-carrier.component");
var rate_cards_api_service_1 = require("./shared/api-services/ratecard/rate-cards.api.service");
var rate_cards_shared_service_1 = require("./shared/services/ratecard/rate-cards.shared.service");
var main_table_shared_service_1 = require("./shared/services/ratecard/main-table.shared.service");
// Ratecard Importer
var importer_table_component_1 = require("./ratecard/ratecard-importer/importer-table/importer-table.component");
var importer_api_service_1 = require("./ratecard/ratecard-importer/services/importer.api.service");
var importer_shared_service_1 = require("./ratecard/ratecard-importer/services/importer.shared.service");
var upload_rates_dialog_component_1 = require("./ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component");
// Trunks
var trunks_table_component_1 = require("./trunks/trunks-table/trunks-table.component");
var add_trunks_component_1 = require("./trunks/trunks-table/dialog/add-trunks/add-trunks.component");
var delete_trunks_component_1 = require("./trunks/trunks-table/dialog/delete-trunks/delete-trunks.component");
var delete_rates_component_1 = require("./ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component");
var detach_trunks_component_1 = require("./ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component");
var trunks_api_service_1 = require("./trunks/services/trunks.api.service");
var trunks_shared_service_1 = require("./trunks/services/trunks.shared.service");
// Call Plan
var call_plan_table_component_1 = require("./callplan/call-plan-table/call-plan-table.component");
var add_callplan_component_1 = require("./callplan/call-plan-table/dialog/add-callplan/add-callplan.component");
var del_callplan_component_1 = require("./callplan/call-plan-table/dialog/del-callplan/del-callplan.component");
var add_rate_card_component_1 = require("./callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component");
var dettach_ratecards_component_1 = require("./callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component");
var add_code_component_1 = require("./callplan/call-plan-table/dialog/add-code/add-code.component");
var dettach_codes_component_1 = require("./callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component");
var call_plan_add_ratecard_component_1 = require("./callplan/call-plan-add-ratecard/call-plan-add-ratecard.component");
var call_plan_add_code_component_1 = require("./callplan/call-plan-add-code/call-plan-add-code.component");
var call_plan_api_service_1 = require("./callplan/services/call-plan.api.service");
var call_plan_shared_service_1 = require("./callplan/services/call-plan.shared.service");
var attach_callplan_codes_shared_service_1 = require("./shared/services/callplan/attach-callplan-codes.shared.service");
// LCR
var lcr_callplan_table_component_1 = require("./lcr/lcr-callplan-table/lcr-callplan-table.component");
var lcr_carrier_table_component_1 = require("./lcr/lcr-carrier-table/lcr-carrier-table.component");
var lcr_ratecard_table_component_1 = require("./lcr/lcr-ratecard-table/lcr-ratecard-table.component");
var lcr_trunk_table_component_1 = require("./lcr/lcr-trunk-table/lcr-trunk-table.component");
var lcr_api_service_1 = require("./lcr/services/lcr.api.service");
var lcr_shared_service_1 = require("./lcr/services/lcr.shared.service");
// Accounts
var accounts_component_1 = require("./accounts/accounts.component");
var login_component_1 = require("./login/login.component");
var registration_component_1 = require("./registration/registration.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                // Main Layout Components
                app_component_1.AppComponent, side_nav_component_1.SideNavComponent, top_nav_component_1.TopNavComponent,
                // User
                login_component_1.LoginComponent, registration_component_1.RegistrationComponent,
                // Dashboard
                dashboard_component_1.DashboardComponent,
                // Carrier
                carrier_table_component_1.CarrierTableComponent, add_carrier_dialog_component_1.AddCarrierDialogComponent, del_carrier_dialog_component_1.DelCarrierDialogComponent, carrier_profile_component_1.CarrierProfileComponent,
                // Ratecard
                rate_cards_table_component_1.RateCardsTableComponent, delete_rate_cards_dialog_component_1.DeleteRateCardsDialogComponent, importer_table_component_1.ImporterTableComponent,
                upload_rates_dialog_component_1.UploadRatesDialogComponent, rate_cards_add_trunks_component_1.RateCardsAddTrunksComponent, rate_cards_convert_csv_component_1.RateCardsConvertCsvComponent, delete_rates_component_1.DeleteRatesComponent,
                ratecard_view_carrier_component_1.RatecardViewCarrierComponent,
                // Trunk
                trunks_table_component_1.TrunksTableComponent, add_trunks_component_1.AddTrunksComponent, delete_trunks_component_1.DeleteTrunksComponent, detach_trunks_component_1.DetachTrunksComponent,
                // Call Plan
                call_plan_table_component_1.CallPlanTableComponent, add_callplan_component_1.AddCallPlanComponent, del_callplan_component_1.DelCallPlanComponent, call_plan_add_ratecard_component_1.CallPlanAddRatecardComponent,
                call_plan_add_code_component_1.CallPlanAddCodeComponent, add_code_component_1.AddCodeComponent, add_rate_card_component_1.AddRateCardComponent, dettach_ratecards_component_1.DettachRatecardsComponent,
                dettach_codes_component_1.DettachCodesComponent,
                // LCR
                lcr_callplan_table_component_1.LcrCallPlanTableComponent, lcr_carrier_table_component_1.LcrCarrierTableComponent, lcr_ratecard_table_component_1.LcrRatecardTableComponent, lcr_trunk_table_component_1.LcrTrunkTableComponent,
                // Account
                accounts_component_1.AccountsComponent,
                // Global
                success_snackbar_component_1.SuccessSnackbarComponent, error_snackbar_component_1.ErrorSnackbarComponent,
            ],
            imports: [
                // Core Angular Modules
                http_1.HttpModule, http_2.HttpClientModule, platform_browser_1.BrowserModule,
                forms_1.FormsModule, common_1.CommonModule, forms_1.ReactiveFormsModule,
                // Third Party Modules
                ngx_papaparse_1.PapaParseModule, ng_sidebar_1.SidebarModule,
                // Angular Materials Modules
                animations_1.BrowserAnimationsModule, material_1.MatFormFieldModule, material_1.MatInputModule, material_1.MatStepperModule, material_1.MatButtonModule, material_1.MatSelectModule, material_4.MatCheckboxModule,
                material_2.MatRadioModule, material_2.MatIconModule, material_2.MatDialogModule, material_4.MatToolbarModule, material_2.MatDatepickerModule, material_3.MatNativeDateModule,
                material_4.MatTabsModule, material_3.MatAutocompleteModule, material_4.MatExpansionModule, material_3.MatSliderModule, material_3.MatSnackBarModule,
                // Ag Grid & Routing
                ag_grid_angular_1.AgGridModule.withComponents([]),
                router_1.RouterModule.forRoot([
                    { path: '', component: dashboard_component_1.DashboardComponent },
                    { path: 'dashboard', component: dashboard_component_1.DashboardComponent },
                    { path: 'carrier-view', component: carrier_table_component_1.CarrierTableComponent },
                    { path: 'rate-card-importer', component: importer_table_component_1.ImporterTableComponent },
                    { path: 'rate-card-view', component: rate_cards_table_component_1.RateCardsTableComponent },
                    { path: 'rate-card-add-trunks', component: rate_cards_add_trunks_component_1.RateCardsAddTrunksComponent },
                    { path: 'rate-card-convert-csv', component: rate_cards_convert_csv_component_1.RateCardsConvertCsvComponent },
                    { path: 'rate-card-view-carrier', component: ratecard_view_carrier_component_1.RatecardViewCarrierComponent },
                    { path: 'trunks', component: trunks_table_component_1.TrunksTableComponent },
                    { path: 'call-plan-view', component: call_plan_table_component_1.CallPlanTableComponent },
                    { path: 'call-plan-add-ratecard', component: call_plan_add_ratecard_component_1.CallPlanAddRatecardComponent },
                    { path: 'call-plan-add-code', component: call_plan_add_code_component_1.CallPlanAddCodeComponent },
                    { path: 'lcr-carrier', component: lcr_carrier_table_component_1.LcrCarrierTableComponent },
                    { path: 'lcr-ratecard', component: lcr_ratecard_table_component_1.LcrRatecardTableComponent },
                    { path: 'lcr-trunk', component: lcr_trunk_table_component_1.LcrTrunkTableComponent },
                    { path: 'lcr-callplan', component: lcr_callplan_table_component_1.LcrCallPlanTableComponent },
                    { path: 'accounts', component: accounts_component_1.AccountsComponent },
                    { path: 'login', component: login_component_1.LoginComponent },
                    { path: 'registration', component: registration_component_1.RegistrationComponent }
                ])
            ],
            providers: [
                // Global services
                nestedAgGrid_shared_service_1.NestedAgGridService, snackbar_shared_service_1.SnackbarSharedService, buttonStates_shared_service_1.ToggleButtonStateService, codes_shared_service_1.CodesSharedService,
                api_settings_shared_service_1.ApiSettingsSharedService,
                // Carrier
                carrier_api_service_1.CarrierService, carrier_shared_service_1.CarrierSharedService,
                // Ratecard
                importer_api_service_1.ImporterService, importer_shared_service_1.ImporterSharedService, rate_cards_api_service_1.RateCardsService, rate_cards_shared_service_1.RateCardsSharedService,
                // Ratecard Viewer
                iso_codes_shared_service_1.IsoCodesSharedService, main_table_shared_service_1.MainTableSharedService,
                trunks_api_service_1.TrunksService, trunks_shared_service_1.TrunksSharedService,
                call_plan_api_service_1.CallPlanService, call_plan_shared_service_1.CallPlanSharedService, attach_callplan_codes_shared_service_1.CodesFormSharedService,
                lcr_api_service_1.LCRService, lcr_shared_service_1.LCRSharedService,
            ],
            bootstrap: [app_component_1.AppComponent],
            entryComponents: [
                // Carrier
                add_carrier_dialog_component_1.AddCarrierDialogComponent, del_carrier_dialog_component_1.DelCarrierDialogComponent,
                // Ratecard
                delete_rate_cards_dialog_component_1.DeleteRateCardsDialogComponent, upload_rates_dialog_component_1.UploadRatesDialogComponent,
                success_snackbar_component_1.SuccessSnackbarComponent, error_snackbar_component_1.ErrorSnackbarComponent,
                delete_trunks_component_1.DeleteTrunksComponent, add_trunks_component_1.AddTrunksComponent, delete_rates_component_1.DeleteRatesComponent, detach_trunks_component_1.DetachTrunksComponent,
                add_callplan_component_1.AddCallPlanComponent, del_callplan_component_1.DelCallPlanComponent, add_code_component_1.AddCodeComponent, add_rate_card_component_1.AddRateCardComponent,
                dettach_ratecards_component_1.DettachRatecardsComponent, dettach_codes_component_1.DettachCodesComponent
            ],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map